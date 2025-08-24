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
  