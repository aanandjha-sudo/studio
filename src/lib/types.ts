
import type { Timestamp } from 'firebase/firestore';

export interface Comment {
    id: string;
    author: {
      name: string;
      avatarUrl: string;
      handle: string;
    };
    content: string;
    timestamp: number;
}
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
    commentsData?: Comment[];
    timestamp: Timestamp | number; 
  }

export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: Timestamp | number;
}

export interface UserProfile {
    id: string;
    username: string;
    displayName: string;
    email: string;
    photoURL?: string;
    bio?: string;
    followers: string[];
    following: string[];
    privacySettings?: {
        hideFollowers: boolean;
        hideFollowing: boolean;
    }
}

export interface Conversation {
    id: string;
    participantIds: string[];
    participants: Pick<UserProfile, 'id' | 'displayName' | 'photoURL'>[];
    lastMessage: string;
    timestamp: Timestamp | number;
}


export interface SuperChat {
    user: string;
    message: string;
    amount: number;
    color: string;
}

export interface LiveStream {
    id: string;
    userId: string;
    userDisplayName: string;
    userAvatarUrl: string;
    title: string;
    viewers: number;
    thumbnail: string;
    timestamp: Timestamp | number;
}
