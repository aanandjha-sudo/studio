
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Camera, User, Clapperboard } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import LiveStreamPlayer from "@/components/live-stream-player";
import { getActiveLiveStreams } from "@/lib/firestore-edge";
import type { LiveStream } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function LivePage() {
    const [activeStreams, setActiveStreams] = useState<LiveStream[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStreams = async () => {
            setLoading(true);
            const streams = await getActiveLiveStreams();
            setActiveStreams(streams);
            setLoading(false);
        };
        fetchStreams();

        const interval = setInterval(fetchStreams, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    const StreamSkeleton = () => (
        <Card className="overflow-hidden">
            <Skeleton className="w-full aspect-video" />
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
        </Card>
    );

    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                <header className="p-4 border-b flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Live Streams</h1>
                        <p className="text-muted-foreground">Watch what's happening now</p>
                    </div>
                    <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Link href="/live/go">
                            <Camera className="mr-2 h-4 w-4" /> Go Live
                        </Link>
                    </Button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <StreamSkeleton key={i} />)
                        ) : activeStreams.length > 0 ? activeStreams.map(stream => (
                           <Dialog key={stream.id}>
                               <DialogTrigger asChild>
                                    <Card className="overflow-hidden cursor-pointer group">
                                        <div className="relative aspect-video">
                                            <Image src={stream.thumbnail} alt={stream.title} layout="fill" objectFit="cover" className="transition-transform group-hover:scale-105" />
                                            <div className="absolute top-2 left-2 bg-red-500/80 text-white px-2 py-0.5 rounded-md text-xs font-bold">LIVE</div>
                                            <div className="absolute bottom-2 right-2 bg-black/60 text-white px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {stream.viewers.toLocaleString()}
                                            </div>
                                        </div>
                                        <CardHeader>
                                            <CardTitle className="truncate">{stream.title}</CardTitle>
                                            <CardDescription>by {stream.userDisplayName}</CardDescription>
                                        </CardHeader>
                                    </Card>
                               </DialogTrigger>
                               <DialogContent className="max-w-4xl p-0 border-0">
                                   <LiveStreamPlayer stream={stream} />
                               </DialogContent>
                           </Dialog>
                        )) : (
                            <div className="col-span-full text-center py-16 text-muted-foreground">
                                <Clapperboard className="mx-auto h-12 w-12 mb-4" />
                                <h3 className="text-xl font-semibold">No one is live right now</h3>
                                <p>Why not be the first one?</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
