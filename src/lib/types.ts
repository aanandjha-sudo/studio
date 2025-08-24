
import type { Timestamp, FieldValue } from "firebase/firestore";

export interface Post {
    id: string;
    author: {
      name: string;
      avatarUrl: string;
      handle: string;
    };
    userId: string;
    content: string;
    type: 'text' | 'image' | 'video';
    mediaUrl?: string;
    mediaAiHint?: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: Timestamp | FieldValue;
  }

export interface Message {
    id: string;
    sender: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
}

export interface Conversation {
    id: string;
    participant: {
        name: string;
        avatarUrl: string;
    };
    lastMessage: string;
    timestamp: string;
    unread: number;
}

export interface SuperChat {
    user: string;
    message: string;
    amount: number;
    color: string;
}
