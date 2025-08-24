
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

// In-memory storage for mock users. In a real app, this would be your database.
const mockUserDatabase: { [email: string]: { password: string, user: MockUser } } = {};

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('vivid-stream-user');
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
    const storedUser = mockUserDatabase[email];
    if (storedUser && storedUser.password === pass) {
      localStorage.setItem('vivid-stream-user', JSON.stringify(storedUser.user));
      setUser(storedUser.user);
    } else {
      throw new Error("Invalid email or password.");
    }
  };
  
  const signupWithEmail = async (email: string, pass: string, username: string) => {
    if (mockUserDatabase[email]) {
        throw new Error("An account with this email already exists.");
    }

    const newUser: MockUser = {
        uid: `mock_${Date.now()}`,
        email: email,
        displayName: username,
        photoURL: `https://placehold.co/100x100.png`,
    };

    mockUserDatabase[email] = { password: pass, user: newUser };
    
    localStorage.setItem('vivid-stream-user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = async () => {
    localStorage.removeItem('vivid-stream-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
