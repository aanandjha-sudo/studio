
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Clapperboard, Bookmark, UserX, UserCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth-provider";
import { followUser, unfollowUser, getUserProfile } from "@/lib/firestore";
import React, { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";

const userPosts = [
  { id: 1, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'abstract painting' },
  { id: 2, type: 'video', url: 'https://placehold.co/400x400.png', aiHint: 'city timelapse' },
  { id: 3, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'forest trail' },
  { id: 4, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'mountain landscape' },
  { id: 5, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'modern architecture' },
  { id: 6, type: 'video', url: 'https://placehold.co/400x400.png', aiHint: 'ocean waves' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchProfile = useCallback(async (uid: string) => {
    const userProfile = await getUserProfile(uid);
    setProfile(userProfile);
    if (user && userProfile?.followers) {
      setIsFollowing(userProfile.followers.includes(user.uid));
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
    }
  }, [user, fetchProfile]);

  const handleAuthAction = (callback: () => void) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to perform this action.",
        action: <Button onClick={() => router.push('/login')}>Login</Button>
      });
    } else {
      callback();
    }
  };
  
  const handleMessage = () => handleAuthAction(() => router.push('/messages'));

  const handleBlock = () => handleAuthAction(() => {
    toast({
        variant: "destructive",
        title: "User Blocked",
        description: `@${profile?.username} has been blocked.`,
    });
  });

  const handleFollowToggle = () => handleAuthAction(async () => {
    if (!user || !profile) return;
    if (isFollowing) {
      await unfollowUser(user.uid, profile.id);
      toast({ title: `Unfollowed @${profile.username}` });
    } else {
      await followUser(user.uid, profile.id);
      toast({ title: `Followed @${profile.username}` });
    }
    await fetchProfile(profile.id);
  });

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user || !profile) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <UserCircle className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Login to see your profile</h2>
            <p className="text-muted-foreground mb-4">
                Your personal profile, posts, and saved items will be here.
            </p>
            <Button asChild>
                <Link href="/login">Login / Sign Up</Link>
            </Button>
        </div>
      </AppLayout>
    );
  }

  const canSeeFollowers = !profile.privacySettings?.hideFollowers || profile.id === user.uid;
  const canSeeFollowing = !profile.privacySettings?.hideFollowing || profile.id === user.uid;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary">
                <AvatarImage src={profile.photoURL || "https://placehold.co/200x200.png"} />
                <AvatarFallback>{profile.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <h1 className="text-3xl font-bold">{profile.displayName || "BRO'S SHARE User"}</h1>
                   {profile.id === user.uid && (
                     <Button variant="ghost" size="icon" asChild>
                       <Link href="/settings">
                         <Settings />
                       </Link>
                     </Button>
                   )}
                </div>
                <p className="text-muted-foreground mt-1">@{profile.username || 'brosuser'}</p>
                <p className="mt-4 max-w-md">
                  {profile.bio || 'Digital creator | Exploring the world one pixel at a time.'}
                </p>
                <div className="flex justify-center md:justify-start gap-6 mt-4 text-center">
                  <div>
                    <p className="font-bold text-lg">128</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{canSeeFollowers ? (profile.followers?.length || 0) : '—'}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{canSeeFollowing ? (profile.following?.length || 0) : '—'}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-2 justify-center md:justify-start">
                  {profile.id !== user.uid && (
                    <>
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleFollowToggle}>
                        {isFollowing ? 'Unfollow' : 'Follow'}
                      </Button>
                      <Button variant="outline" onClick={handleMessage}>Message</Button>
                      <Button variant="outline" size="icon" onClick={handleBlock} aria-label="Block user">
                        <UserX className="h-5 w-5 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </header>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts"><Grid3x3 className="h-4 w-4 mr-2" /> Posts</TabsTrigger>
                <TabsTrigger value="videos"><Clapperboard className="h-4 w-4 mr-2" /> Videos</TabsTrigger>
                <TabsTrigger value="saved"><Bookmark className="h-4 w-4 mr-2" /> Saved</TabsTrigger>
              </TabsList>
              <TabsContent value="posts">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mt-4">
                  {userPosts.map(post => (
                    <div key={post.id} className="relative aspect-square group">
                      <Image 
                        src={post.url} 
                        alt="User post" 
                        fill 
                        className="object-cover rounded-md transition-transform group-hover:scale-105"
                        data-ai-hint={post.aiHint}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="videos" className="text-center p-8">
                <p>No videos yet.</p>
              </TabsContent>
              <TabsContent value="saved" className="text-center p-8">
                <p>No saved posts.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
