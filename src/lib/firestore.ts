
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

// User Profile
export const createUserProfile = async (uid: string, profileData: Omit<UserProfile, 'id' | 'followers' | 'following'>): Promise<void> => {
  const userProfile: UserProfile = {
    id: uid,
    ...profileData,
    followers: [],
    following: [],
    photoURL: profileData.photoURL || `https://placehold.co/100x100.png`,
    bio: profileData.bio || "A new member of BRO'S SHARE community!",
    privacySettings: { hideFollowers: false, hideFollowing: false }
  };
  await setDoc(doc(db, 'users', uid), userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
};

// Follow functionality
export const followUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    await updateDoc(currentUserRef, { following: arrayUnion(targetUserId) });
    await updateDoc(targetUserRef, { followers: arrayUnion(currentUserId) });
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserRef = doc(db, 'users', currentUserId);
    const targetUserRef = doc(db, 'users', targetUserId);
    
    await updateDoc(currentUserRef, { following: arrayRemove(targetUserId) });
    await updateDoc(targetUserRef, { followers: arrayRemove(currentUserId) });
};

// Posts
export const addPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp'>): Promise<Post> => {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...postData,
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: Date.now(),
  });
  return { id: docRef.id, ...postData, likes: 0, comments: 0, shares: 0, timestamp: Date.now() };
};

export const getPosts = async (): Promise<Post[]> => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};


// Messaging - Mocked for now
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
