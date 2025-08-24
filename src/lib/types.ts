
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
    senderId: string;
    text: string;
    timestamp: Timestamp;
}

export interface UserProfile {
    id: string;
    name: string;
    avatarUrl: string;
}

export interface Conversation {
    id: string;
    participantIds: string[];
    participants: UserProfile[];
    lastMessage: string;
    timestamp: Timestamp;
}


export interface SuperChat {
    user: string;
    message: string;
    amount: number;
    color: string;
}
