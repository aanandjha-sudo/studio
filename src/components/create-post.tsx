
"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, Video, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface CreatePostProps {
  onCreatePost: (content: string, type: 'text' | 'image' | 'video') => Promise<void>;
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getInitials = (name?: string | null) => {
    if (!name) return "VU";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }
  
  const handlePost = async (type: 'text' | 'image' | 'video') => {
     if (!user) {
       toast({
          variant: "destructive",
          title: "Please log in",
          description: "You need to be logged in to create a post.",
      });
      return;
    }
    if (!content.trim() && type === 'text') {
      toast({
          variant: "destructive",
          title: "Cannot post empty message",
          description: "Please write something before posting.",
      });
      return;
    }
    
    setIsSubmitting(true);
    const postContent = type === 'text' ? content : `Check out my new ${type}!`;
    await onCreatePost(postContent, type);
    setContent("");
    setIsSubmitting(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePost('text');
  };

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
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2 text-muted-foreground">
              <Button variant="ghost" size="icon" type="button" onClick={() => handlePost('image')} disabled={isSubmitting}>
                <ImageIcon />
              </Button>
              <Button variant="ghost" size="icon" type="button" onClick={() => handlePost('video')} disabled={isSubmitting}>
                <Video />
              </Button>
            </div>
            <Button type="submit" disabled={!content.trim() || isSubmitting}>
              <Send className="mr-2" />
              {isSubmitting ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
