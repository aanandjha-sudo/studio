
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser, UserCredential } from 'firebase/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<UserCredential>;
  signupWithEmail: (email: string, pass: string) => Promise<UserCredential>;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = (email: string, pass: string): Promise<UserCredential> => {
    return signInWithEmailAndPassword(auth, email, pass);
  };
  
  const signupWithEmail = (email: string, pass: string): Promise<UserCredential> => {
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
