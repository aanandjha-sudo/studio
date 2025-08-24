
'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Heart, MessageCircle, Share2, Smile, MoreVertical, Send } from "lucide-react";
import type { Post, Comment } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Input } from "./ui/input";

const reactions = ["❤️", "😂", "🤯", "😢", "😡"];

interface PostCardProps {
  post: Post;
  onPostUpdate: (post: Post) => void;
}

const PostCard = React.memo(function PostCard({ post, onPostUpdate }: PostCardProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);

  const handleAuthAction = (callback: () => void) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Please log in",
            description: "You need to be logged in to perform this action.",
            action: <Button onClick={() => router.push('/login')}>Login</Button>
        });
        return;
    }
    callback();
  };

  const handleLike = () => handleAuthAction(() => {
    const updatedLikes = isLiked ? post.likes - 1 : post.likes + 1;
    setIsLiked(!isLiked);
    onPostUpdate({ ...post, likes: updatedLikes });
  });

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(postUrl);
    toast({
      title: "Link Copied!",
      description: "The post link has been copied to your clipboard.",
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuthAction(() => {
      if (!commentText.trim() || !user?.displayName) return;
      const newComment: Comment = {
        id: `comment_${Date.now()}`,
        author: {
          name: user.displayName,
          avatarUrl: user.photoURL || "https://placehold.co/100x100.png",
          handle: user.displayName.toLowerCase().replace(/\s/g, '_'),
        },
        content: commentText,
        timestamp: Date.now(),
      };
      
      const updatedComments = [...(post.commentsData || []), newComment];
      onPostUpdate({ ...post, comments: updatedComments.length, commentsData: updatedComments });
      setCommentText("");
      setIsCommentVisible(true); // Keep comments visible after posting
    });
  }

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />
          <AvatarFallback>
            {post.author.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{post.author.name}</p>
          <p className="text-sm text-muted-foreground">@{post.author.handle}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAuthAction(() => toast({ title: `Followed @${post.author.handle}`}))}>Follow @{post.author.handle}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAuthAction(() => toast({ title: "Post muted" }))}>Mute post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAuthAction(() => toast({ title: "Post reported" }))}>Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}
        {post.type !== "text" && post.mediaUrl && (
          <div className={`relative mt-4 rounded-lg overflow-hidden border ${!post.content ? 'mt-0' : ''}`}>
            {post.type === 'image' ? (
                <Image
                    src={post.mediaUrl}
                    alt="Post media"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                />
            ) : (
                <video src={post.mediaUrl} controls className="w-full h-auto" />
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 flex flex-col items-start">
         <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <span>{post.likes} Likes</span>
                <span className="mx-1">·</span>
                <span>{post.comments} Comments</span>
            </div>
            <div className="flex gap-1">
                <Button variant="ghost" size="icon" className={`rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 ${isLiked ? 'text-red-500' : ''}`} onClick={handleLike}>
                    <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => setIsCommentVisible(!isCommentVisible)}>
                    <MessageCircle className="h-5 w-5" />
                </Button>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10">
                            <Smile className="h-5 w-5" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1">
                        <div className="flex gap-1">
                            {reactions.map((r) => (
                                <Button key={r} variant="ghost" size="icon" className="text-xl rounded-full" onClick={() => handleAuthAction(() => toast({ title: `Reacted with ${r}`}))}>{r}</Button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10" onClick={handleShare}>
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </div>

        {isCommentVisible && (
            <div className="w-full mt-4 space-y-4">
                <form onSubmit={handleAddComment} className="flex gap-2">
                    <Input 
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button type="submit" size="icon"><Send/></Button>
                </form>
                <div className="space-y-2">
                    {post.commentsData?.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 text-sm">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={comment.author.avatarUrl} />
                                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted p-2 rounded-lg">
                                <p className="font-semibold">{comment.author.name}</p>
                                <p>{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
  );
});

export default PostCard;
