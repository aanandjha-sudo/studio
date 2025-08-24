
"use client";

import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical } from "lucide-react";
import type { Message, Conversation } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { getConversations, getMessages, addMessage } from "@/lib/firestore";
import { serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

// Placeholder for users you can message
const availableUsers = [
  { id: "user2", name: "PixelQueen", avatarUrl: "https://placehold.co/100x100.png" },
  { id: "user3", name: "Alex_Travels", avatarUrl: "https://placehold.co/100x100.png" },
  { id: "user4", name: "SynthWaveMaster", avatarUrl: "https://placehold.co/100x100.png" },
];


export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

   useEffect(() => {
    if (!user) return;
    const unsubscribe = getConversations(
      user.uid,
      (convos) => {
        setConversations(convos);
        if (!selectedConversation && convos.length > 0) {
            setSelectedConversation(convos[0]);
        }
      },
      (error) => {
        console.error("Error fetching conversations:", error);
        toast({ variant: "destructive", title: "Could not load chats" });
      }
    );
    return () => unsubscribe();
  }, [user, selectedConversation, toast]);

  useEffect(() => {
    if (!selectedConversation) return;
    const unsubscribe = getMessages(
      selectedConversation.id,
      setMessages,
      (error) => {
        console.error("Error fetching messages:", error);
        toast({ variant: "destructive", title: "Could not load messages" });
      }
    );
    return () => unsubscribe();
  }, [selectedConversation, toast]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p.id !== user.uid)?.id;
    if (!receiverId) return;

    try {
        await addMessage(selectedConversation.id, user.uid, receiverId, newMessage);
        setNewMessage("");
    } catch (error) {
        console.error("Error sending message:", error);
        toast({ variant: "destructive", title: "Failed to send message" });
    }
  };

   const handleSelectConversation = (convo: Conversation) => {
    setSelectedConversation(convo);
  };
  
  const getParticipant = (convo: Conversation) => {
      return convo.participants.find(p => p.id !== user?.uid);
  }

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
                {conversations.map(convo => {
                    const participant = getParticipant(convo);
                    if (!participant) return null;
                    return (
                        <div 
                            key={convo.id} 
                            className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}
                            onClick={() => handleSelectConversation(convo)}
                        >
                            <Avatar>
                                <AvatarImage src={participant.avatarUrl} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate">{participant.name}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                <p>{convo.timestamp ? new Date(convo.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
                            </div>
                        </div>
                    )
                })}
           </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="md:col-span-2 xl:col-span-3 flex flex-col h-full">
            {selectedConversation && user ? (
                <>
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={getParticipant(selectedConversation)?.avatarUrl} />
                                <AvatarFallback>{getParticipant(selectedConversation)?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{getParticipant(selectedConversation)?.name}</h2>
                        </div>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.senderId === user.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p>{msg.text}</p>
                                        <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}</p>
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
