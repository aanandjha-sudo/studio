
'use server';

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
    where,
    Timestamp,
    arrayUnion, 
    arrayRemove 
} from 'firebase/firestore';
import type { Post, UserProfile, Conversation, Message } from './types';

// --- USER PROFILE FUNCTIONS ---
export const createUserProfile = async (uid: string, profileData: Omit<UserProfile, 'id' | 'followers' | 'following'>): Promise<void> => {
    const userDocRef = doc(db, 'users', uid);
    const userProfile: UserProfile = {
        id: uid,
        ...profileData,
        followers: [],
        following: [],
        photoURL: profileData.photoURL || `https://placehold.co/100x100.png`,
        bio: profileData.bio || "A new member of the community!",
        privacySettings: { hideFollowers: false, hideFollowing: false }
    };
    await setDoc(userDocRef, userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    return userSnap.exists() ? userSnap.data() as UserProfile : null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, data);
};

// --- FOLLOW FUNCTIONS ---
export const followUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserDocRef = doc(db, 'users', currentUserId);
    const targetUserDocRef = doc(db, 'users', targetUserId);
    
    await updateDoc(currentUserDocRef, { following: arrayUnion(targetUserId) });
    await updateDoc(targetUserDocRef, { followers: arrayUnion(currentUserId) });
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserDocRef = doc(db, 'users', currentUserId);
    const targetUserDocRef = doc(db, 'users', targetUserId);

    await updateDoc(currentUserDocRef, { following: arrayRemove(targetUserId) });
    await updateDoc(targetUserDocRef, { followers: arrayRemove(currentUserId) });
};

// --- POST FUNCTIONS ---
export const addPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp'>): Promise<Post> => {
    const postsCollectionRef = collection(db, 'posts');
    const newPostData = {
        ...postData,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(postsCollectionRef, newPostData);
    return { id: docRef.id, ...newPostData };
};

export const getPosts = async (): Promise<Post[]> => {
    const postsCollectionRef = collection(db, 'posts');
    const q = query(postsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
};


// --- MESSAGING FUNCTIONS ---
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    const convosCollectionRef = collection(db, 'conversations');
    const q = query(convosCollectionRef, where('participantIds', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    
    const conversations = querySnapshot.docs.map(doc => doc.data() as Conversation);

    // Fetch user details for participants
    for (const convo of conversations) {
        convo.participants = [];
        for (const pid of convo.participantIds) {
            const userProfile = await getUserProfile(pid);
            if (userProfile) {
                convo.participants.push({
                    id: userProfile.id,
                    displayName: userProfile.displayName,
                    photoURL: userProfile.photoURL,
                });
            }
        }
    }
    return conversations.sort((a, b) => b.timestamp - a.timestamp);
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
    const messagesCollectionRef = collection(db, `conversations/${conversationId}/messages`);
    const q = query(messagesCollectionRef, orderBy('timestamp', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
};

export const addMessage = async (
    conversationId: string,
    senderId: string,
    receiverId: string, // Keep for potential new convo logic
    text: string
): Promise<Message> => {
    const messagesCollectionRef = collection(db, `conversations/${conversationId}/messages`);
    const newMessageData = {
        senderId,
        text,
        timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(messagesCollectionRef, newMessageData);

    // Update the conversation's last message
    const convoDocRef = doc(db, 'conversations', conversationId);
    await updateDoc(convoDocRef, {
        lastMessage: text,
        timestamp: newMessageData.timestamp,
    });
    
    return { id: docRef.id, ...newMessageData };
};
