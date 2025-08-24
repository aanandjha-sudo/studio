
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth-provider";
import { searchUsers, followUser, unfollowUser } from "@/lib/firestore-edge";
import type { UserProfile } from "@/lib/types";
import { UserPlus, UserMinus, MessageSquare, SearchX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const query = searchParams.get("q") || "";

  useEffect(() => {
    if (query) {
      const fetchResults = async () => {
        setLoading(true);
        const users = await searchUsers(query);
        setResults(users);
        setLoading(false);
      };
      fetchResults();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [query]);
  
  const handleFollowToggle = async (targetUser: UserProfile) => {
    if (!user) {
        toast({ variant: "destructive", title: "You must be logged in to follow users."});
        return;
    }
    const isFollowing = targetUser.followers.includes(user.uid);
    if (isFollowing) {
        await unfollowUser(user.uid, targetUser.id);
        toast({ title: `Unfollowed @${targetUser.username}` });
    } else {
        await followUser(user.uid, targetUser.id);
        toast({ title: `Followed @${targetUser.username}` });
    }
    // Re-fetch to update follower status
    const users = await searchUsers(query);
    setResults(users);
  };

  const UserSkeleton = () => (
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
        <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
        </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Search Results</h1>
          {query && <p className="text-muted-foreground">Showing results for: "{query}"</p>}
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="space-y-2">
                    <UserSkeleton />
                    <UserSkeleton />
                    <UserSkeleton />
                </div>
              )}
              {!loading && results.length > 0 && (
                <div className="divide-y">
                  {results.map((profile) => {
                    const isFollowing = user ? profile.followers.includes(user.uid) : false;
                    return (
                        <div key={profile.id} className="flex items-center justify-between p-4">
                            <Link href={`/profile/${profile.id}`} className="flex items-center gap-4 group">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={profile.photoURL} />
                                    <AvatarFallback>{profile.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold group-hover:underline">{profile.displayName}</p>
                                    <p className="text-sm text-muted-foreground">@{profile.username}</p>
                                </div>
                            </Link>
                            {user && user.uid !== profile.id && (
                                <div className="flex gap-2">
                                    <Button size="sm" variant={isFollowing ? 'outline' : 'default'} onClick={() => handleFollowToggle(profile)}>
                                        {isFollowing ? <UserMinus className="mr-2" /> : <UserPlus className="mr-2" />}
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => router.push('/messages')}>
                                        <MessageSquare className="mr-2" />
                                        Message
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                  })}
                </div>
              )}
              {!loading && results.length === 0 && (
                 <div className="text-center py-16 text-muted-foreground">
                    <SearchX className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-xl font-semibold">No users found</h3>
                    <p>Try a different search term.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
