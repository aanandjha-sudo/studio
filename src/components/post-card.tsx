'use client';

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Heart, MessageCircle, Share2, Smile, MoreVertical, PlayCircle } from "lucide-react";
import type { Post } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";

const reactions = ["❤️", "😂", "🤯", "😢", "😡"];

export default function PostCard({ post }: { post: Post }) {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: action,
    });
  };

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
            <DropdownMenuItem onClick={() => handleAction(`Followed @${post.author.handle}`)}>Follow @{post.author.handle}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Post muted")}>Mute post</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Post reported")}>Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="px-4 pb-2">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.type !== "text" && post.mediaUrl && (
          <div className="mt-4 relative rounded-lg overflow-hidden border">
            <Image
              src={post.mediaUrl}
              alt="Post media"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint={post.mediaAiHint}
            />
            {post.type === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white/80" />
                </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <span>{post.likes} Likes</span>
            <span className="mx-1">·</span>
            <span>{post.comments} Comments</span>
        </div>
        <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10" onClick={() => handleAction("Post liked!")}>
                <Heart className="h-5 w-5" />
            </Button>
             <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => handleAction("Comment added!")}>
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
                            <Button key={r} variant="ghost" size="icon" className="text-xl rounded-full" onClick={() => handleAction(`Reacted with ${r}`)}>{r}</Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10" onClick={() => handleAction("Post shared!")}>
                <Share2 className="h-5 w-5" />
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
