
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User type, equivalent to FirebaseUser
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock UserCredential type
interface MockUserCredential {
  user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<MockUserCredential>;
  signupWithEmail: (email: string, pass: string) => Promise<MockUserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    loginWithEmail: async () => { throw new Error("Auth context not initialized"); },
    signupWithEmail: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => { throw new Error("Auth context not initialized"); },
});

const mockUser: MockUser = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'BRO S SHARE User',
  photoURL: 'https://placehold.co/100x100.png',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking auth state
    // To test the logged-out state, you can set the initial user to null
    // To test the logged-in state, you can set it to mockUser
    setUser(null); 
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<MockUserCredential> => {
    setLoading(true);
    console.log(`Mock Login with: ${email}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const loggedInUser = { ...mockUser, email, displayName: email.split('@')[0] };
            setUser(loggedInUser);
            setLoading(false);
            resolve({ user: loggedInUser });
        }, 500);
    });
  };
  
  const signupWithEmail = async (email: string, pass: string): Promise<MockUserCredential> => {
    setLoading(true);
    console.log(`Mock Signup with: ${email}`);
    return new Promise(resolve => {
        setTimeout(() => {
            const newUser = { ...mockUser, email, displayName: email.split('@')[0] };
            setUser(newUser);
            setLoading(false);
            resolve({ user: newUser });
        }, 500);
    });
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    return new Promise(resolve => {
        setTimeout(() => {
            setUser(null);
            setLoading(false);
            resolve();
        }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
