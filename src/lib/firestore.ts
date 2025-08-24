
import { db } from './firebase';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    query, 
    orderBy, 
    limit, 
    arrayUnion, 
    arrayRemove 
} from 'firebase/firestore';
import type { Post, UserProfile, Conversation, Message } from './types';
import { mockUserDatabase, mockPosts, mockConversations, mockMessages } from './mock-data';

// --- MOCK API FUNCTIONS ---

// User Profile
export const createUserProfile = async (uid: string, profileData: Omit<UserProfile, 'id' | 'followers' | 'following'>): Promise<void> => {
    const existingUser = mockUserDatabase.find(u => u.id === uid);
    if (existingUser) return;

    const userProfile: UserProfile = {
        id: uid,
        ...profileData,
        followers: [],
        following: [],
        photoURL: profileData.photoURL || `https://placehold.co/100x100.png`,
        bio: profileData.bio || "A new member of BRO'S SHARE community!",
        privacySettings: { hideFollowers: false, hideFollowing: false }
    };
    mockUserDatabase.push(userProfile);
    console.log("Created mock user:", userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    return mockUserDatabase.find(u => u.id === uid) || null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userIndex = mockUserDatabase.findIndex(u => u.id === uid);
    if (userIndex !== -1) {
        mockUserDatabase[userIndex] = { ...mockUserDatabase[userIndex], ...data };
    }
};

// Follow functionality
export const followUser = async (currentUserId: string, targetUserId: string) => {
    const currentUser = await getUserProfile(currentUserId);
    const targetUser = await getUserProfile(targetUserId);
    
    if (currentUser && targetUser) {
        if (!currentUser.following.includes(targetUserId)) currentUser.following.push(targetUserId);
        if (!targetUser.followers.includes(currentUserId)) targetUser.followers.push(currentUserId);
    }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const currentUser = await getUserProfile(currentUserId);
    const targetUser = await getUserProfile(targetUserId);

    if (currentUser && targetUser) {
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
    }
};

// Posts
export const addPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp'>): Promise<Post> => {
  const newPost: Post = {
    id: `post-${Date.now()}`,
    ...postData,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: Date.now(),
  };
  mockPosts.unshift(newPost);
  return newPost;
};

export const getPosts = async (): Promise<Post[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPosts].sort((a, b) => b.timestamp - a.timestamp);
};


// Messaging
export const getConversations = (userId: string): Conversation[] => {
  return mockConversations.filter(c => c.participantIds.includes(userId))
    .sort((a, b) => b.timestamp - a.timestamp);
};

export const getMessages = (conversationId: string): Message[] => {
  return (mockMessages[conversationId] || []).sort((a, b) => a.timestamp - b.timestamp);
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
    if (!mockMessages[conversationId]) {
        mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);
    
    const convo = mockConversations.find(c => c.id === conversationId);
    if (convo) {
        convo.lastMessage = text;
        convo.timestamp = newMessage.timestamp;
    }
    return newMessage;
};
