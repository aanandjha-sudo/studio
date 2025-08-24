
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// Mock User type, equivalent to FirebaseUser
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Stored user credentials for mock auth
interface StoredUser extends MockUser {
    password?: string;
}

// Mock UserCredential type
interface MockUserCredential {
  user: MockUser;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<MockUserCredential>;
  signupWithEmail: (email: string, pass: string, username: string) => Promise<MockUserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    loginWithEmail: async () => { throw new Error("Auth context not initialized"); },
    signupWithEmail: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => { throw new Error("Auth context not initialized"); },
});

// In-memory store for users
const mockUserDatabase: StoredUser[] = [];

const defaultUser: MockUser = {
  uid: 'mock-user-123',
  email: 'user@example.com',
  displayName: 'BRO S SHARE User',
  photoURL: 'https://placehold.co/100x100.png',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(null); 
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<MockUserCredential> => {
    setLoading(true);
    console.log(`Attempting login for: ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = mockUserDatabase.find(u => u.email === email && u.password === pass);
            if (foundUser) {
                const loggedInUser = {
                    uid: foundUser.uid,
                    email: foundUser.email,
                    displayName: foundUser.displayName,
                    photoURL: foundUser.photoURL,
                };
                setUser(loggedInUser);
                setLoading(false);
                resolve({ user: loggedInUser });
            } else {
                setLoading(false);
                reject(new Error("Invalid email or password."));
            }
        }, 500);
    });
  };
  
  const signupWithEmail = async (email: string, pass: string, username: string): Promise<MockUserCredential> => {
    setLoading(true);
    console.log(`Mock Signup with: ${email}, username: ${username}`);
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (mockUserDatabase.some(u => u.email === email)) {
                setLoading(false);
                return reject(new Error("Email already in use."));
            }
            if (mockUserDatabase.some(u => u.displayName === username)) {
                setLoading(false);
                return reject(new Error("Username already taken."));
            }

            const newUser: StoredUser = { 
                uid: `mock-user-${Date.now()}`, 
                email,
                displayName: username,
                photoURL: `https://placehold.co/100x100.png`,
                password: pass
            };

            mockUserDatabase.push(newUser);
            console.log("Current user db:", mockUserDatabase);
            
            const userForSession = { ...newUser };
            delete userForSession.password; // Don't keep password in the active user state

            setUser(userForSession);
            setLoading(false);
            resolve({ user: userForSession });
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
