
"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/app-layout";
import PostCard from "@/components/post-card";
import { getPostById, updatePost } from "@/lib/firestore-edge";
import type { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";

export default function SinglePostPage({ params }: { params: { postId: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const fetchedPost = await getPostById(params.postId);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load the post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.postId]);

  const handlePostUpdate = (updatedPost: Post) => {
    setPost(updatedPost);
    updatePost(updatedPost.id, updatedPost);
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
          <h1 className="text-2xl font-bold">Post</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto">
            {loading && <PostSkeleton />}
            {error && (
              <div className="text-center py-16 text-destructive">
                <p>{error}</p>
              </div>
            )}
            {!loading && post && (
              <PostCard 
                post={post} 
                onPostUpdate={handlePostUpdate}
                isSinglePostView={true}
              />
            )}
            {!loading && !post && !error && (
                <div className="text-center py-16 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 mb-4" />
                    <p>This post does not exist or has been removed.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
