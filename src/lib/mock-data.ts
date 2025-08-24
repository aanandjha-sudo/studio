
import type { Post, UserProfile, Conversation, Message, StoredUser } from "./types";

// In-memory store for users, separate from profiles
export const mockAuthUsers: StoredUser[] = [];

export let mockUserDatabase: UserProfile[] = [
    {
        id: 'user-1-default',
        username: 'vividuser',
        displayName: 'Vivid User',
        email: 'vivid@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Just a default user enjoying the vibrant world.',
        followers: ['user-2-default'],
        following: ['user-2-default', 'user-3-default'],
        privacySettings: { hideFollowers: false, hideFollowing: false }
    },
    {
        id: 'user-2-default',
        username: 'pixel_master',
        displayName: 'Pixel Master',
        email: 'pixel@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Creating art, one pixel at a time.',
        followers: ['user-1-default', 'user-3-default'],
        following: ['user-1-default'],
        privacySettings: { hideFollowers: true, hideFollowing: false }
    },
     {
        id: 'user-3-default',
        username: 'synthwave_dreamer',
        displayName: 'Synthwave Dreamer',
        email: 'synth@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Riding the retro digital waves.',
        followers: ['user-1-default'],
        following: ['user-2-default'],
        privacySettings: { hideFollowers: false, hideFollowing: false }
    }
];

export let mockPosts: Post[] = [
    {
        id: 'post-1',
        author: { name: 'Pixel Master', avatarUrl: 'https://placehold.co/100x100.png', handle: 'pixel_master' },
        userId: 'user-2-default',
        content: 'Just finished a new piece! What do you all think? #digitalart',
        type: 'image',
        mediaUrl: 'https://placehold.co/600x400.png',
        mediaAiHint: 'pixel art city',
        likes: 152,
        comments: 12,
        shares: 5,
        timestamp: Date.now() - 1000 * 60 * 5
    },
    {
        id: 'post-2',
        author: { name: 'Synthwave Dreamer', avatarUrl: 'https://placehold.co/100x100.png', handle: 'synthwave_dreamer' },
        userId: 'user-3-default',
        content: 'Chill vibes for the evening commute.',
        type: 'text',
        likes: 89,
        comments: 7,
        shares: 3,
        timestamp: Date.now() - 1000 * 60 * 30
    },
     {
        id: 'post-3',
        author: { name: 'Vivid User', avatarUrl: 'https://placehold.co/100x100.png', handle: 'vividuser' },
        userId: 'user-1-default',
        content: 'Check out this cool video I found!',
        type: 'video',
        mediaUrl: 'https://placehold.co/600x400.png',
        mediaAiHint: 'lofi animation loop',
        likes: 204,
        comments: 23,
        shares: 11,
        timestamp: Date.now() - 1000 * 60 * 120
    },
];

export let mockConversations: Conversation[] = [
    {
        id: 'convo-1',
        participantIds: ['user-1-default', 'user-2-default'],
        participants: [
            { id: 'user-1-default', displayName: 'Vivid User', photoURL: 'https://placehold.co/100x100.png' },
            { id: 'user-2-default', displayName: 'Pixel Master', photoURL: 'https://placehold.co/100x100.png' }
        ],
        lastMessage: 'Hey, love your latest post!',
        timestamp: Date.now() - 1000 * 60 * 60
    }
];

export let mockMessages: { [conversationId: string]: Message[] } = {
    'convo-1': [
        { id: 'msg-1', senderId: 'user-1-default', text: 'Hey, love your latest post!', timestamp: Date.now() - 1000 * 60 * 60 },
        { id: 'msg-2', senderId: 'user-2-default', text: 'Thanks so much! I appreciate it.', timestamp: Date.now() - 1000 * 60 * 59 },
    ]
};
