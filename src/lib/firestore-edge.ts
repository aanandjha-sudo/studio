
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
    arrayRemove,
    deleteDoc,
    writeBatch
} from 'firebase/firestore';
import type { Post, UserProfile, Conversation, Message, LiveStream } from './types';

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
export const addPost = async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'shares' | 'timestamp' | 'commentsData'>): Promise<Post> => {
    const postsCollectionRef = collection(db, 'posts');
    const newPostData = {
        ...postData,
        likes: 0,
        comments: 0,
        shares: 0,
        commentsData: [],
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

export const updatePost = async (postId: string, updatedData: Partial<Post>) => {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, updatedData);
}


// --- MESSAGING FUNCTIONS ---
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    const convosCollectionRef = collection(db, 'conversations');
    const q = query(convosCollectionRef, where('participantIds', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    
    const conversations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data
        } as Conversation;
    });

    const participantProfiles = new Map<string, any>();

    for (const convo of conversations) {
        for (const pid of convo.participantIds) {
            if (!participantProfiles.has(pid)) {
                const userProfile = await getUserProfile(pid);
                if (userProfile) {
                    participantProfiles.set(pid, {
                        id: userProfile.id,
                        displayName: userProfile.displayName,
                        photoURL: userProfile.photoURL,
                    });
                }
            }
        }
        convo.participants = convo.participantIds.map(pid => participantProfiles.get(pid)).filter(Boolean);
    }
    
    return conversations.sort((a, b) => (b.timestamp as Timestamp).toMillis() - (a.timestamp as Timestamp).toMillis());
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
    
    const convoDocRef = doc(db, 'conversations', conversationId);
    
    const batch = writeBatch(db);
    const newMessageRef = doc(collection(db, `conversations/${conversationId}/messages`));
    batch.set(newMessageRef, newMessageData);
    batch.update(convoDocRef, {
        lastMessage: text,
        timestamp: newMessageData.timestamp,
    });
    
    await batch.commit();
    
    return { id: newMessageRef.id, ...newMessageData };
};


// --- LIVE STREAM FUNCTIONS ---

export const createLiveStream = async (streamData: Omit<LiveStream, 'id' | 'timestamp' | 'viewers'>): Promise<LiveStream> => {
    const liveStreamsCollectionRef = collection(db, 'liveStreams');
    const newStreamData = {
        ...streamData,
        timestamp: Timestamp.now(),
        viewers: Math.floor(Math.random() * 5000) + 100, // Random viewers for simulation
    };
    const docRef = await addDoc(liveStreamsCollectionRef, newStreamData);
    return { id: docRef.id, ...newStreamData };
};

export const getActiveLiveStreams = async (): Promise<LiveStream[]> => {
    const liveStreamsCollectionRef = collection(db, 'liveStreams');
    const q = query(liveStreamsCollectionRef, orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LiveStream));
};

export const deleteLiveStream = async (streamId: string): Promise<void> => {
    const streamDocRef = doc(db, 'liveStreams', streamId);
    await deleteDoc(streamDocRef);
};
