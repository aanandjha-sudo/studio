
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { createUserProfile } from '@/lib/firestore-edge';

const auth = getAuth(app);

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<any>;
  signupWithEmail: (email: string, pass: string, username: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    loginWithEmail: async () => { throw new Error("Auth context not initialized"); },
    signupWithEmail: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => { throw new Error("Auth context not initialized"); },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signupWithEmail = async (email: string, pass: string, username: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const firebaseUser = userCredential.user;
    
    // Update Firebase Auth profile
    await updateProfile(firebaseUser, { 
        displayName: username,
        photoURL: `https://placehold.co/100x100.png` 
    });

    // Create user profile in Firestore
    await createUserProfile(firebaseUser.uid, {
        username: username,
        displayName: username,
        email: email,
        photoURL: firebaseUser.photoURL || `https://placehold.co/100x100.png`
    });

    // Manually update the user state to reflect the profile changes immediately
    setUser({ ...firebaseUser, displayName: username, photoURL: firebaseUser.photoURL });

    return userCredential;
  };

  const logout = async () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
