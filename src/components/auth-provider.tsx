
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { StoredUser } from '@/lib/types';
import { createUserProfile } from '@/lib/firestore';
import { mockAuthUsers } from '@/lib/mock-data';

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in sessionStorage
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<MockUserCredential> => {
    setLoading(true);
    console.log(`Attempting login for: ${email}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundUser = mockAuthUsers.find(u => u.email === email && u.password === pass);
            if (foundUser) {
                const loggedInUser: MockUser = {
                    uid: foundUser.uid,
                    email: foundUser.email,
                    displayName: foundUser.displayName,
                    photoURL: foundUser.photoURL,
                };
                setUser(loggedInUser);
                sessionStorage.setItem('authUser', JSON.stringify(loggedInUser));
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
        setTimeout(async () => {
            if (mockAuthUsers.some(u => u.email === email)) {
                setLoading(false);
                return reject(new Error("Email already in use."));
            }
            if (mockAuthUsers.some(u => u.displayName === username)) {
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

            mockAuthUsers.push(newUser);
            console.log("Current auth user db:", mockAuthUsers);

            // Create a corresponding user profile
            await createUserProfile(newUser.uid, {
                username: username,
                displayName: username,
                email: email,
                photoURL: newUser.photoURL
            });
            
            const userForSession: MockUser = { 
              uid: newUser.uid,
              email: newUser.email,
              displayName: newUser.displayName,
              photoURL: newUser.photoURL
            };

            setUser(userForSession);
            sessionStorage.setItem('authUser', JSON.stringify(userForSession));
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
            sessionStorage.removeItem('authUser');
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
