
"use client";

import { useEffect, useState, useCallback } from "react";
import AppLayout from "@/components/app-layout";
import PostCard from "@/components/post-card";
import CreatePost from "@/components/create-post";
import type { Post } from "@/lib/types";
import { getPosts, addPost, updatePost } from "@/lib/firestore-edge";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const newPosts = await getPosts();
      setPosts(newPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch posts.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCreatePost = async (content: string, type: 'text' | 'image' | 'video', mediaUrl?: string) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not signed in",
            description: "You must be signed in to create a post.",
            action: <Button onClick={() => router.push('/login')}>Login</Button>
        });
        return;
    }
    
    if (!user.displayName) {
        toast({
            variant: "destructive",
            title: "Profile not found",
            description: "Could not find your user profile to create a post.",
        });
        return;
    }

    const newPostData = {
        author: {
            name: user.displayName || "Anonymous",
            avatarUrl: user.photoURL || "https://placehold.co/100x100.png",
            handle: user.displayName.toLowerCase().replace(/\\s/g, '_') || "user",
        },
        userId: user.uid,
        content: content,
        type: type,
        ...(type !== 'text' && { mediaUrl }),
    };
    
    try {
        await addPost(newPostData);
        toast({
            title: "Post Created!",
            description: "Your post is now live on the feed.",
        });
        fetchPosts(); // Refetch posts to show the new one
    } catch (error) {
        console.error("Error creating post:", error);
        toast({
            variant: "destructive",
            title: "Error Creating Post",
            description: "There was an issue creating your post. Please try again."
        });
    }
  };

  const handlePostUpdate = async (updatedPost: Post) => {
    setPosts(prevPosts => prevPosts.map(p => p.id === updatedPost.id ? updatedPost : p));
    await updatePost(updatedPost.id, updatedPost);
  };


  const PostSkeleton = () => (
    <div className="space-y-4 p-4 border rounded-lg">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Home Feed</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
              <CreatePost onCreatePost={handleCreatePost} />
              {loading && (
                <div className="space-y-6">
                  <PostSkeleton />
                  <PostSkeleton />
                </div>
              )}
              {!loading && posts.map((post) => (
                <PostCard key={post.id} post={post} onPostUpdate={handlePostUpdate} />
              ))}
              {!loading && posts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No posts yet. Be the first to share something!</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
