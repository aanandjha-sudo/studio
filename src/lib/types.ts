
export interface Post {
    id: string;
    author: {
      name: string;
      avatarUrl: string;
      handle: string;
    };
    content: string;
    type: 'text' | 'image' | 'video';
    mediaUrl?: string;
    mediaAiHint?: string;
    likes: number;
    comments: number;
    shares: number;
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
