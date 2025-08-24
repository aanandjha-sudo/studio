
"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Video, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";

interface CreatePostProps {
  onCreatePost: (content: string, type: 'text' | 'image' | 'video', mediaUrl?: string) => Promise<void>;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getInitials = (name?: string | null) => {
    if (!name) return "VU";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  const handleMediaButtonClick = (type: 'image' | 'video') => {
    if (fileInputRef.current) {
        fileInputRef.current.accept = type === 'image' ? 'image/*' : 'video/*';
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
        setMediaType(file.type.startsWith('image') ? 'image' : 'video');
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handlePost = async () => {
    if (!user) {
      toast({
          variant: "destructive",
          title: "Please log in",
          description: "You need to be logged in to create a post.",
      });
      return;
    }
    if (!content.trim() && !mediaPreview) {
      toast({
          variant: "destructive",
          title: "Cannot create empty post",
          description: "Please write something or add media.",
      });
      return;
    }
    
    setIsSubmitting(true);
    const postType = mediaType || 'text';
    await onCreatePost(content, postType, mediaPreview || undefined);
    
    // Reset state
    setContent("");
    setMediaPreview(null);
    setMediaType(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    setIsSubmitting(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost();
  };

  const removeMedia = () => {
    setMediaPreview(null);
    setMediaType(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  if (!user) {
    return (
        <Card>
            <CardContent className="p-4 text-center">
                <p className="text-muted-foreground">
                    <Link href="/login" className="underline text-primary">Log in</Link> or <Link href="/signup" className="underline text-primary">Sign up</Link> to share your thoughts!
                </p>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Avatar>
              <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={2}
            />
          </div>

          {mediaPreview && (
            <div className="mt-4 relative">
                {mediaType === 'image' ? (
                    <Image src={mediaPreview} alt="Preview" width={500} height={300} className="rounded-lg w-full object-cover" />
                ) : (
                    <video src={mediaPreview} controls className="rounded-lg w-full" />
                )}
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={removeMedia}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2 text-muted-foreground">
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <Button variant="ghost" size="icon" type="button" onClick={() => handleMediaButtonClick('image')} disabled={isSubmitting}>
                <ImageIcon />
              </Button>
              <Button variant="ghost" size="icon" type="button" onClick={() => handleMediaButtonClick('video')} disabled={isSubmitting}>
                <Video />
              </Button>
            </div>
            <Button type="submit" disabled={(!content.trim() && !mediaPreview) || isSubmitting}>
              <Send className="mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
