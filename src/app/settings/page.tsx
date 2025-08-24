
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/mock-data";
import type { UserProfile } from "@/lib/types";
import { Home } from "lucide-react";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hideFollowers, setHideFollowers] = useState(false);
  const [hideFollowing, setHideFollowing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback((uid: string) => {
    const userProfile = getUserProfile(uid);
    setProfile(userProfile);
    setHideFollowers(userProfile?.privacySettings?.hideFollowers || false);
    setHideFollowing(userProfile?.privacySettings?.hideFollowing || false);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      fetchProfile(user.uid);
    }
  }, [user, loading, router, fetchProfile]);
  
  const handleSaveChanges = async () => {
    if (!user) return;
    setIsSaving(true);
    updateUserProfile(user.uid, {
      privacySettings: {
        hideFollowers,
        hideFollowing,
      },
    });
    toast({
      title: "Settings Saved",
      description: "Your privacy settings have been updated.",
    });
    setIsSaving(false);
  };

  if (loading || !profile) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading settings...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
       <div className="flex flex-col h-full">
        <header className="p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
           <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Feed
            </Link>
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy Settings</CardTitle>
                        <CardDescription>
                            Control who can see your activity and lists.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                            <Label htmlFor="hide-followers" className="flex flex-col space-y-1">
                                <span>Hide Followers List</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                   Only you will be able to see who follows you.
                                </span>
                            </Label>
                            <Switch
                                id="hide-followers"
                                checked={hideFollowers}
                                onCheckedChange={setHideFollowers}
                            />
                        </div>
                         <div className="flex items-center justify-between space-x-2 p-4 rounded-lg border">
                            <Label htmlFor="hide-following" className="flex flex-col space-y-1">
                                <span>Hide Following List</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                   Only you will be able to see who you follow.
                                </span>
                            </Label>
                            <Switch
                                id="hide-following"
                                checked={hideFollowing}
                                onCheckedChange={setHideFollowing}
                            />
                        </div>
                    </CardContent>
                </Card>
                 <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
      </div>
    </AppLayout>
  );
}
