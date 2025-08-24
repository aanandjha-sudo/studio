
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AppLayout from "@/components/app-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, MoreVertical, MessageSquare } from "lucide-react";
import type { Message, Conversation } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import { getConversations, getMessages, addMessage } from "@/lib/firestore-edge";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

   useEffect(() => {
    if (!user) return;
    const fetchConversations = async () => {
        const convos = await getConversations(user.uid);
        setConversations(convos);
        if (!selectedConversation && convos.length > 0) {
            setSelectedConversation(convos[0]);
        }
    }
    fetchConversations();
  }, [user, selectedConversation]);

  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
        const initialMessages = await getMessages(selectedConversation.id);
        setMessages(initialMessages);
    }
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedConversation) return;

    const receiverId = selectedConversation.participants.find(p => p.id !== user.uid)?.id;
    if (!receiverId) return;

    const sentMessage = await addMessage(selectedConversation.id, user.uid, receiverId, newMessage);
    setMessages([...messages, sentMessage]);
    setNewMessage("");
  };

   const handleSelectConversation = (convo: Conversation) => {
    setSelectedConversation(convo);
  };
  
  const getParticipant = (convo: Conversation) => {
      return convo.participants.find(p => p.id !== user?.uid);
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Login to view messages</h2>
            <p className="text-muted-foreground mb-4">
                You need to be logged in to send and receive messages.
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
                                <AvatarImage src={participant.photoURL} />
                                <AvatarFallback>{participant.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold truncate">{participant.displayName}</p>
                                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                <p>{new Date(convo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
                                <AvatarImage src={getParticipant(selectedConversation)?.photoURL} />
                                <AvatarFallback>{getParticipant(selectedConversation)?.displayName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">{getParticipant(selectedConversation)?.displayName}</h2>
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
                                        <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
