
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';

// This is a mock user type, mirroring the structure of a FirebaseUser
// but used for our local, mock authentication.
export interface MockUser extends Partial<FirebaseUser> {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

// Stored user will also include the password for local verification.
interface StoredUserRecord {
    password: string;
    user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    loginWithEmail: async () => { throw new Error("Auth context not initialized"); },
    signupWithEmail: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => { throw new Error("Auth context not initialized"); },
});

const USER_DB_KEY = 'vivid-stream-user-database';
const LOGGED_IN_USER_KEY = 'vivid-stream-logged-in-user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to get user database from localStorage
  const getUserDatabase = (): { [email: string]: StoredUserRecord } => {
    try {
      const db = localStorage.getItem(USER_DB_KEY);
      return db ? JSON.parse(db) : {};
    } catch (e) {
      return {};
    }
  };

  // Helper to save user database to localStorage
  const setUserDatabase = (db: { [email: string]: StoredUserRecord }) => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(db));
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOGGED_IN_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
        setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const userDb = getUserDatabase();
    const storedUserRecord = userDb[email];
    if (storedUserRecord && storedUserRecord.password === pass) {
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(storedUserRecord.user));
      setUser(storedUserRecord.user);
    } else {
      throw new Error("Invalid email or password.");
    }
  };
  
  const signupWithEmail = async (email: string, pass: string, username: string) => {
    const userDb = getUserDatabase();
    if (userDb[email]) {
        throw new Error("An account with this email already exists on this device.");
    }

    const newUser: MockUser = {
        uid: `mock_${Date.now()}`,
        email: email,
        displayName: username,
        photoURL: `https://placehold.co/100x100.png`,
    };

    userDb[email] = { password: pass, user: newUser };
    setUserDatabase(userDb);
    
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
