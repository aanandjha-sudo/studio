
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Heart, Gift, Zap } from "lucide-react";
import SuperChat from "@/components/super-chat";
import type { SuperChat as SuperChatType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

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

interface LiveStreamPlayerProps {
    stream: {
        id: number;
        user: string;
        title: string;
        viewers: number;
        thumbnail: string;
    }
}

export default function LiveStreamPlayer({ stream }: LiveStreamPlayerProps) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [superChats, setSuperChats] = useState<SuperChatType[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const { toast } = useToast();

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

    const handleAction = (action: string) => {
        toast({
            title: action,
        });
    };

    return (
        <div className="w-full h-[80vh] grid grid-cols-1 lg:grid-cols-3 lg:gap-0">
            <div className="lg:col-span-2 bg-background flex flex-col">
                 <div className="aspect-video bg-black rounded-lg overflow-hidden relative flex-1">
                    <Image src={stream.thumbnail} layout="fill" objectFit="cover" alt="Live stream" />
                     <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                           <span className="relative flex h-3 w-3">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                           </span>
                           LIVE
                        </div>
                        <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            👤 {stream.viewers.toLocaleString()} watching
                        </div>
                     </div>
                </div>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-red-500">
                            <AvatarImage src="https://placehold.co/100x100.png" />
                            <AvatarFallback>{stream.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-lg">{stream.title}</p>
                            <p className="text-sm text-muted-foreground">Streamed by {stream.user}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col rounded-none border-0 border-l">
                    <CardHeader>
                        <CardTitle>Live Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-hidden p-4 pt-0">
                         {superChats.length > 0 && (
                            <div className="space-y-2 mb-2">
                                {superChats.map((chat, index) => (
                                    <div key={index} className={`p-2 rounded-lg text-white`} style={{ backgroundColor: chat.color }}>
                                        <div className="font-bold flex justify-between text-sm">
                                            <span>{chat.user}</span>
                                            <span>${chat.amount.toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm">{chat.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-red-500" onClick={() => handleAction("Reaction sent!")}>
                                <Heart/>
                                <span className="text-xs">React</span>
                            </Button>
                            <SuperChat onSendSuperChat={handleSendSuperChat}>
                                 <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-yellow-500">
                                    <Zap/>
                                    <span className="text-xs">Super Chat</span>
                                </Button>
                            </SuperChat>
                            <Button variant="ghost" className="flex flex-col h-auto items-center gap-1 text-muted-foreground hover:text-green-500" onClick={() => handleAction("Gift sent!")}>
                                <Gift/>
                                <span className="text-xs">Send Gift</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

