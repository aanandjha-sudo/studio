
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore";
import { app } from "./firebase";
import type { Post } from "./types";

const db = getFirestore(app);
const postsCollection = collection(db, "posts");

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
