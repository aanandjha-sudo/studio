
"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/app-layout";
import PostCard from "@/components/post-card";
import CreatePost from "@/components/create-post";
import type { Post } from "@/lib/types";
import { getPosts, addPost } from "@/lib/mock-data";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const newPosts = getPosts();
    setPosts(newPosts);
    setLoading(false);
  }, []);

  const handleCreatePost = async (content: string) => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not signed in",
            description: "You must be signed in to create a post.",
            action: <button onClick={() => router.push('/login')} className="bg-white text-black p-1 rounded">Login</button>
        });
        return;
    }

    const newPostData = {
        author: {
            name: user.displayName || "Anonymous",
            avatarUrl: user.photoURL || "https://placehold.co/100x100.png",
            handle: user.displayName?.toLowerCase() || "user",
        },
        userId: user.uid,
        content: content,
    };
    
    const newPost = addPost(newPostData);
    setPosts([newPost, ...posts]);
  };

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
                <div className="text-center py-8">
                  <p>Loading posts...</p>
                </div>
              )}
              {!loading && posts.map((post) => (
                <PostCard key={post.id} post={post} />
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
