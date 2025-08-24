import Image from "next/image";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid3x3, Clapperboard, Bookmark } from "lucide-react";

const userPosts = [
  { id: 1, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'abstract painting' },
  { id: 2, type: 'video', url: 'https://placehold.co/400x400.png', aiHint: 'city timelapse' },
  { id: 3, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'forest trail' },
  { id: 4, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'mountain landscape' },
  { id: 5, type: 'image', url: 'https://placehold.co/400x400.png', aiHint: 'modern architecture' },
  { id: 6, type: 'video', url: 'https://placehold.co/400x400.png', aiHint: 'ocean waves' },
];

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-primary">
                <AvatarImage src="https://placehold.co/200x200.png" />
                <AvatarFallback>VU</AvatarFallback>
              </Avatar>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Vivid User</h1>
                <p className="text-muted-foreground mt-1">@vividuser</p>
                <p className="mt-4 max-w-md">
                  Digital creator | Exploring the world one pixel at a time | Lover of sunsets and synthwave 🎵
                </p>
                <div className="flex justify-center md:justify-start gap-6 mt-4 text-center">
                  <div>
                    <p className="font-bold text-lg">128</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">12.4k</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">1.2k</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
                <div className="mt-6 flex gap-2 justify-center md:justify-start">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Follow</Button>
                  <Button variant="outline">Message</Button>
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
