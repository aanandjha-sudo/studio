
import type { Post, Conversation, Message, UserProfile } from "./types";

// --- MOCK DATABASE ---

let users: UserProfile[] = [
    {
        id: 'user-1',
        username: 'vividuser',
        displayName: 'Vivid User',
        email: 'vivid@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Just a test user enjoying the vibrant world.',
        followers: ['user-2'],
        following: ['user-2', 'user-3'],
        privacySettings: { hideFollowers: false, hideFollowing: false }
    },
    {
        id: 'user-2',
        username: 'pixel_master',
        displayName: 'Pixel Master',
        email: 'pixel@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Creating art, one pixel at a time.',
        followers: ['user-1', 'user-3'],
        following: ['user-1'],
        privacySettings: { hideFollowers: true, hideFollowing: false }
    },
    {
        id: 'user-3',
        username: 'synthwave_dreamer',
        displayName: 'Synthwave Dreamer',
        email: 'synth@example.com',
        photoURL: 'https://placehold.co/100x100.png',
        bio: 'Riding the retro digital waves.',
        followers: ['user-1'],
        following: ['user-2'],
        privacySettings: { hideFollowers: false, hideFollowing: false }
    }
];

let posts: Post[] = [
    {
        id: 'post-1',
        author: { name: 'Pixel Master', avatarUrl: 'https://placehold.co/100x100.png', handle: 'pixel_master' },
        userId: 'user-2',
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
        userId: 'user-3',
        content: 'Chill vibes for the evening commute.',
        type: 'text',
        likes: 89,
        comments: 7,
        shares: 3,
        timestamp: Date.now() - 1000 * 60 * 30
    },
];

let conversations: Conversation[] = [
    {
        id: 'convo-1',
        participantIds: ['user-1', 'user-2'],
        participants: [
            { id: 'user-1', displayName: 'Vivid User', photoURL: 'https://placehold.co/100x100.png' },
            { id: 'user-2', displayName: 'Pixel Master', photoURL: 'https://placehold.co/100x100.png' }
        ],
        lastMessage: 'Hey, love your latest post!',
        timestamp: Date.now() - 1000 * 60 * 60
    }
];

let messages: { [conversationId: string]: Message[] } = {
    'convo-1': [
        { id: 'msg-1', senderId: 'user-1', text: 'Hey, love your latest post!', timestamp: Date.now() - 1000 * 60 * 60 },
        { id: 'msg-2', senderId: 'user-2', text: 'Thanks so much! I appreciate it.', timestamp: Date.now() - 1000 * 60 * 59 },
    ]
};


// --- MOCK API FUNCTIONS ---

// User Profile
export const createUserProfile = (profileData: Omit<UserProfile, 'id' | 'followers' | 'following'>): UserProfile => {
  const newUser: UserProfile = {
    id: `user-${Date.now()}`,
    ...profileData,
    followers: [],
    following: [],
    photoURL: profileData.photoURL || `https://placehold.co/100x100.png`,
    bio: profileData.bio || "A new member of the Vivid Stream community!",
    privacySettings: { hideFollowers: false, hideFollowing: false }
  };
  users.push(newUser);
  return newUser;
};

export const getUserProfile = (uid: string): UserProfile | null => {
    return users.find(u => u.id === uid) || null;
};

export const updateUserProfile = (uid: string, data: Partial<UserProfile>) => {
    users = users.map(u => u.id === uid ? { ...u, ...data } : u);
};

// Follow functionality
export const followUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (currentUser && targetUser) {
        if (!currentUser.following.includes(targetUserId)) {
            currentUser.following.push(targetUserId);
        }
        if (!targetUser.followers.includes(currentUserId)) {
            targetUser.followers.push(currentUserId);
        }
    }
};

export const unfollowUser = (currentUserId: string, targetUserId: string) => {
    const currentUser = users.find(u => u.id === currentUserId);
    const targetUser = users.find(u => u.id === targetUserId);
    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    }
};

// Posts
export const addPost = (postData: { author: Post['author'], userId: string, content: string }): Post => {
  const newPost: Post = {
    id: `post-${Date.now()}`,
    ...postData,
    type: "text",
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: Date.now(),
  };
  posts.unshift(newPost);
  return newPost;
};

export const getPosts = (): Post[] => {
  return [...posts].sort((a, b) => b.timestamp - a.timestamp);
};

// Messaging
export const getConversations = (userId: string): Conversation[] => {
  return conversations.filter(c => c.participantIds.includes(userId))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getMessages = (conversationId: string): Message[] => {
  return (messages[conversationId] || []).sort((a, b) => a.timestamp - b.timestamp);
};

export const addMessage = (
    conversationId: string, 
    senderId: string,
    receiverId: string,
    text: string
): Message => {
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId,
        text,
        timestamp: Date.now(),
    };
    if (!messages[conversationId]) {
        messages[conversationId] = [];
    }
    messages[conversationId].push(newMessage);
    
    // Update conversation's last message
    const convo = conversations.find(c => c.id === conversationId);
    if (convo) {
        convo.lastMessage = text;
        convo.timestamp = newMessage.timestamp;
    }
    return newMessage;
};
