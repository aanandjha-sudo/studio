
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "vivid-stream-cl1iu",
  "appId": "1:29506674119:web:5be334249d55d914eb4de2",
  "storageBucket": "vivid-stream-cl1iu.appspot.com",
  "apiKey": "AIzaSyDOTz4ON4uXkeV8bvRBoBW8hHTKkxTfnXw",
  "authDomain": "vivid-stream-cl1iu.firebaseapp.com",
  "messagingSenderId": "29506674119"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
