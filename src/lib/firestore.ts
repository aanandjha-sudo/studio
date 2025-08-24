
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  limit,
  doc,
  writeBatch,
  getDocs,
  collectionGroup,
  type DocumentData,
  type FirestoreError,
  type Unsubscribe,
  type Timestamp,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { app } from "./firebase";
import type { Post, Conversation, Message, UserProfile } from "./types";

const db = getFirestore(app);
const postsCollection = collection(db, "posts");
const conversationsCollection = collection(db, "conversations");
const usersCollection = collection(db, "users");

// User Profile
export const createUserProfile = (uid: string, profileData: Omit<UserProfile, 'id'>) => {
  const userProfile: UserProfile = {
    id: uid,
    ...profileData,
    followers: [],
    following: [],
     privacySettings: {
        hideFollowers: false,
        hideFollowing: false,
    }
  };
  return setDoc(doc(db, "users", uid), userProfile);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as UserProfile;
    }
    return null;
};

export const updateUserProfile = (uid: string, data: Partial<UserProfile>) => {
    const userDocRef = doc(db, "users", uid);
    return updateDoc(userDocRef, data);
};


// Follow functionality
export const followUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserRef = doc(db, "users", currentUserId);
    const targetUserRef = doc(db, "users", targetUserId);

    const batch = writeBatch(db);
    batch.update(currentUserRef, { following: arrayUnion(targetUserId) });
    batch.update(targetUserRef, { followers: arrayUnion(currentUserId) });
    
    await batch.commit();
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    const currentUserRef = doc(db, "users", currentUserId);
    const targetUserRef = doc(db, "users", targetUserId);

    const batch = writeBatch(db);
    batch.update(currentUserRef, { following: arrayRemove(targetUserId) });
    batch.update(targetUserRef, { followers: arrayRemove(currentUserId) });
    
    await batch.commit();
};


// Posts
export const addPost = (post: DocumentData) => {
  return addDoc(postsCollection, {
      ...post,
      timestamp: serverTimestamp(),
  });
};

export const getPosts = (
  callback: (posts: Post[]) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe => {
  const q = query(postsCollection, orderBy("timestamp", "desc"));
  
  return onSnapshot(q, (querySnapshot) => {
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });
    callback(posts);
  }, onError);
};

// Messaging
export const getConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe => {
  const q = query(
    conversationsCollection,
    where("participantIds", "array-contains", userId),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Conversation));
    callback(conversations);
  }, onError);
};

export const getMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe => {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Message));
    callback(messages);
  }, onError);
};

export const addMessage = async (
    conversationId: string, 
    senderId: string,
    receiverId: string, // We still need this to update the conversation
    text: string
) => {
    const batch = writeBatch(db);
    const conversationRef = doc(db, "conversations", conversationId);
    const messageRef = doc(collection(conversationRef, "messages"));

    batch.set(messageRef, {
        text,
        senderId,
        timestamp: serverTimestamp(),
    });

    batch.update(conversationRef, {
        lastMessage: text,
        timestamp: serverTimestamp(),
    });

    await batch.commit();
};
