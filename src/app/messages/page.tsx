
"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical } from "lucide-react";
import type { Message, Conversation } from "@/lib/types";

const initialConversations: Conversation[] = [
  {
    id: "1",
    participant: {
      name: "PixelQueen",
      avatarUrl: "https://placehold.co/100x100.png",
    },
    lastMessage: "Hey, love your latest post!",
    timestamp: "10:42 AM",
    unread: 2,
  },
  {
    id: "2",
    participant: {
      name: "Alex_Travels",
      avatarUrl: "https://placehold.co/100x100.png",
    },
    lastMessage: "The Santorini pictures are breathtaking!",
    timestamp: "9:30 AM",
    unread: 0,
  },
  {
    id: "3",
    participant: {
      name: "SynthWaveMaster",
      avatarUrl: "https://placehold.co/100x100.png",
    },
    lastMessage: "No problem, glad you liked the track.",
    timestamp: "Yesterday",
    unread: 0,
  },
];

const initialMessages: Message[] = [
    { id: '1', sender: 'PixelQueen', text: 'Hey, love your latest post!', timestamp: '10:40 AM', isOwn: false },
    { id: '2', sender: 'You', text: 'Thanks so much! I really appreciate it.', timestamp: '10:41 AM', isOwn: true },
    { id: '3', sender: 'PixelQueen', text: "Of course! Your art is amazing.", timestamp: '10:42 AM', isOwn: false },
];


export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
        const msg: Message = {
            id: String(messages.length + 1),
            sender: 'You',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };
        setMessages([...messages, msg]);
        setNewMessage("");
    }
  };

  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 h-full">
        {/* Conversations List */}
        <div className="md:col-span-1 xl:col-span-1 border-r flex flex-col">
           <div className="p-4 border-b">
                <h1 className="text-2xl font-bold">Messages</h1>
                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-10" />
                </div>
           </div>
           <ScrollArea className="flex-1">
                {conversations.map(convo => (
                    <div 
                        key={convo.id} 
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${selectedConversation.id === convo.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedConversation(convo)}
                    >
                        <Avatar>
                            <AvatarImage src={convo.participant.avatarUrl} />
                            <AvatarFallback>{convo.participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold truncate">{convo.participant.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                            <p>{convo.timestamp}</p>
                            {convo.unread > 0 && <span className="mt-1 inline-block bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{convo.unread}</span>}
                        </div>
                    </div>
                ))}
           </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 xl:col-span-3 flex flex-col h-full">
            {selectedConversation ? (
                <>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={selectedConversation.participant.avatarUrl} />
                                <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{selectedConversation.participant.name}</h2>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p>{msg.text}</p>
                                        <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-background">
                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <Input 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />
                            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 shrink-0"><Send className="h-4 w-4" /></Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <p>Select a conversation to start chatting</p>
                </div>
            )}
        </div>
      </div>
    </AppLayout>
  );
}
