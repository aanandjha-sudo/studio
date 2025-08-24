"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, LogIn, Ban, Trash2 } from "lucide-react";

const DEV_ID = "Akj@@//8051964008";

export default function DeveloperPage() {
  const [devIdInput, setDevIdInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIdToBan, setUserIdToBan] = useState("");
  const [postUrlToDelete, setPostUrlToDelete] = useState("");
  const { toast } = useToast();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (devIdInput === DEV_ID) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome, Developer.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid Developer ID.",
      });
    }
  };

  const handleBanUser = () => {
    if (!userIdToBan) return;
    toast({
      title: "Action Sent",
      description: `Request to ban user ID: ${userIdToBan} has been sent.`,
    });
    setUserIdToBan("");
  };

  const handleDeletePost = () => {
    if (!postUrlToDelete) return;
    toast({
      title: "Action Sent",
      description: `Request to delete post at URL: ${postUrlToDelete} has been sent.`,
    });
    setPostUrlToDelete("");
  };

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <CardTitle className="mt-4">Developer Access</CardTitle>
              <CardDescription>
                Please enter your unique Developer ID to access moderation tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dev-id">Developer ID</Label>
                  <Input 
                    id="dev-id" 
                    type="password"
                    placeholder="Enter your Developer ID"
                    value={devIdInput}
                    onChange={(e) => setDevIdInput(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <LogIn className="mr-2 h-4 w-4" />
                  Authenticate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="p-4 border-b">
          <h1 className="text-2xl font-bold">Developer Tools</h1>
          <p className="text-muted-foreground">Use these tools with caution.</p>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Ban className="text-destructive" /> Ban User</CardTitle>
                <CardDescription>
                  Enter the ID of the user you wish to ban from the platform. This action is irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input 
                  placeholder="User ID (e.g., user_123abc)" 
                  value={userIdToBan}
                  onChange={(e) => setUserIdToBan(e.target.value)}
                />
                <Button variant="destructive" onClick={handleBanUser}>Ban User</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trash2 className="text-destructive" /> Delete Post</CardTitle>
                <CardDescription>
                  Enter the full URL of the post you wish to permanently delete. This action is irreversible.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input 
                  placeholder="Post URL (e.g., https://vividstream.com/post/...)"
                  value={postUrlToDelete}
                  onChange={(e) => setPostUrlToDelete(e.target.value)}
                />
                <Button variant="destructive" onClick={handleDeletePost}>Delete Post</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
