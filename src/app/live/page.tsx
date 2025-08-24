"use client"

import React, { useState } from "react";
import Image from "next/image";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Heart, Gift, Zap } from "lucide-react";
import SuperChat from "@/components/super-chat";
import type { SuperChat as SuperChatType } from "@/lib/types";

interface ChatMessage {
    user: string;
    avatar: string;
    message: string;
    color: string;
}

const initialMessages: ChatMessage[] = [
    { user: 'PixelFan', avatar: 'https://placehold.co/100x100.png', message: 'This stream is amazing! 🔥', color: 'text-green-400' },
    { user: 'SynthLover', avatar: 'https://placehold.co/100x100.png', message: 'Loving the vibes!', color: 'text-blue-400' },
    { user: 'ArtAdmirer', avatar: 'https://placehold.co/100x100.png', message: 'So cool to see the process!', color: 'text-purple-400' },
];

export default function LivePage() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [superChats, setSuperChats] = useState<SuperChatType[]>([]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            setMessages([...messages, {
                user: 'You',
                avatar: 'https://placehold.co/100x100.png',
                message: newMessage,
                color: 'text-orange-400'
            }]);
            setNewMessage("");
        }
    }

    const handleSendSuperChat = (chat: SuperChatType) => {
        setSuperChats([chat, ...superChats]);
    };

    return (
        <AppLayout>
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-3 lg:gap-4 p-4">
                <div className="lg:col-span-2">
                    <Card className="h-full flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 border-2 border-red-500">
                                    <AvatarImage src="https://placehold.co/100x100.png" />
                                    <AvatarFallback>VU</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>Vivid User is Live!</CardTitle>
                                    <p className="text-sm text-muted-foreground">Creating a new masterpiece</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-red-500/20 text-red-500 px-3 py-1 rounded-full">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                LIVE
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col">
                            <div className="aspect-video bg-black rounded-lg overflow-hidden relative mb-4">
                                <Image src="https://placehold.co/1280x720.png" layout="fill" objectFit="cover" alt="Live stream" data-ai-hint="digital art" />
                                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
                                    👤 1.2k watching
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2">
                                {superChats.map((chat, index) => (
                                    <div key={index} className={`p-3 rounded-lg text-white`} style={{ backgroundColor: chat.color }}>
                                        <div className="font-bold flex justify-between">
                                            <span>{chat.user}</span>
                                            <span>${chat.amount.toFixed(2)}</span>
                                        </div>
                                        <p>{chat.message}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-1 mt-4 lg:mt-0">
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle>Live Chat</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col overflow-hidden">
                            <ScrollArea className="flex-1 pr-4 -mr-4 mb-4">
                                <div className="space-y-4">
                                    {messages.map((msg, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={msg.avatar} />
                                                <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <span className={`font-semibold text-sm ${msg.color}`}>{msg.user}</span>
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4">
                                <Input 
                                    placeholder="Send a message..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 shrink-0"><Send className="h-4 w-4" /></Button>
                            </form>
                             <div className="flex justify-around pt-4">
                                <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-red-500">
                                    <Heart/>
                                    <span className="text-xs">React</span>
                                </Button>
                                <SuperChat onSendSuperChat={handleSendSuperChat}>
                                     <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-yellow-500">
                                        <Zap/>
                                        <span className="text-xs">Super Chat</span>
                                    </Button>
                                </SuperChat>
                                <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-green-500">
                                    <Gift/>
                                    <span className="text-xs">Send Gift</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
