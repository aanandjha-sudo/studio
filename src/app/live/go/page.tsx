
"use client";

import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, Mic, MicOff, ScreenShare, Camera, Power, User, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function GoLivePage() {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [streamType, setStreamType] = useState<'camera' | 'screen'>('camera');
    const [hasPermission, setHasPermission] = useState(true);

    const getMedia = async (type: 'camera' | 'screen') => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        try {
            const mediaStream = type === 'camera'
                ? await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                : await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setHasPermission(true);
            setStreamType(type);
        } catch (error) {
            console.error(`Error accessing ${type}:`, error);
            setHasPermission(false);
            toast({
                variant: "destructive",
                title: `${type === 'camera' ? 'Camera' : 'Screen Share'} Access Denied`,
                description: `Please enable ${type} permissions to go live.`,
            });
        }
    };
    
    useEffect(() => {
        if (user) {
            getMedia('camera');
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const toggleStream = () => {
        if (isStreaming) {
            stream?.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsStreaming(false);
            if(videoRef.current) videoRef.current.srcObject = null;
             toast({ title: "Stream Ended", description: "You are no longer live." });
        } else {
            getMedia(streamType);
            setIsStreaming(true);
            toast({ title: "You are now live!", description: "Your stream has started successfully." });
        }
    };

    const toggleMute = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };
    
    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-full">
                    <p>Loading...</p>
                </div>
            </AppLayout>
        )
    }

    if (!user) {
         return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Login to Go Live</h2>
                    <p className="text-muted-foreground mb-4">
                        You need to be logged in to start a live stream.
                    </p>
                    <Button asChild>
                        <Link href="/login">Login / Sign Up</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex flex-col h-full">
                <header className="p-4 border-b flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Go Live</h1>
                     <Button variant="outline" asChild>
                        <Link href="/developer">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Developer Tools
                        </Link>
                    </Button>
                </header>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Live Stream Setup</CardTitle>
                                <CardDescription>Configure your stream and go live to your followers.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                                    {!hasPermission && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                                            <Alert variant="destructive" className="w-3/4">
                                                <AlertTitle>Permissions Required</AlertTitle>
                                                <AlertDescription>
                                                    BRO'S SHARE needs access to your camera or screen to start a stream. Please grant permission.
                                                </AlertDescription>
                                            </Alert>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
                                    <Button onClick={toggleStream} className="bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                                        <Power className="mr-2" />
                                        {isStreaming ? "End Stream" : "Start Stream"}
                                    </Button>
                                    <Button variant="outline" onClick={toggleMute} disabled={!isStreaming}>
                                        {isMuted ? <MicOff className="mr-2" /> : <Mic className="mr-2" />}
                                        {isMuted ? "Unmute" : "Mute"}
                                    </Button>
                                    <Button variant="outline" onClick={() => getMedia('camera')} disabled={isStreaming}>
                                        <Camera className="mr-2" />
                                        Use Camera
                                    </Button>
                                    <Button variant="outline" onClick={() => getMedia('screen')} disabled={isStreaming}>
                                        <ScreenShare className="mr-2" />
                                        Share Screen
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
