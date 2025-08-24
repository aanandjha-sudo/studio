// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "vivid-stream-cl1iu",
  appId: "1:29506674119:web:5be334249d55d914eb4de2",
  storageBucket: "vivid-stream-cl1iu.appspot.com",
  apiKey: "AIzaSyDOTz4ON4uXkeV8bvRBoBW8hHTKkxTfnXw",
  authDomain: "vivid-stream-cl1iu.firebaseapp.com",
  messagingSenderId: "29506674119",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
