
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import { createUserProfile, getUserProfile } from '@/lib/firestore-edge';

// This is a mock user type, mirroring the structure of a FirebaseUser
// but used for our local, mock authentication.
export interface MockUser extends Partial<FirebaseUser> {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  requestLoginOtp: (email: string) => Promise<string>;
  verifyLoginOtp: (email: string, otp: string) => Promise<void>;
  signupWithEmail: (email: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    requestLoginOtp: async () => { throw new Error("Auth context not initialized"); },
    verifyLoginOtp: async () => { throw new Error("Auth context not initialized"); },
    signupWithEmail: async () => { throw new Error("Auth context not initialized"); },
    logout: async () => { throw new Error("Auth context not initialized"); },
});

const LOGGED_IN_USER_KEY = 'brosshare-logged-in-user';
const OTP_KEY = 'brosshare-otp';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

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

  const requestLoginOtp = async (email: string): Promise<string> => {
    const userProfile = await getUserProfile(email);
    if (!userProfile) {
      throw new Error("No account found with this email address.");
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem(OTP_KEY, otp); // Use sessionStorage so it's cleared on browser close
    sessionStorage.setItem('otp_email', email);
    return otp; // Return for simulation purposes
  };

  const verifyLoginOtp = async (email: string, otp: string) => {
    const storedOtp = sessionStorage.getItem(OTP_KEY);
    const otpEmail = sessionStorage.getItem('otp_email');

    if (!storedOtp || storedOtp !== otp || otpEmail !== email) {
      throw new Error("Invalid OTP. Please try again.");
    }
    
    const userProfile = await getUserProfile(email);
    if (userProfile) {
       const loggedInUser: MockUser = {
            uid: userProfile.id,
            email: userProfile.email,
            displayName: userProfile.displayName,
            photoURL: userProfile.photoURL,
        };
      localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      sessionStorage.removeItem(OTP_KEY);
      sessionStorage.removeItem('otp_email');
    } else {
      throw new Error("An unexpected error occurred during login.");
    }
  };
  
  const signupWithEmail = async (email: string, username: string) => {
    const existingUser = await getUserProfile(email);
    if (existingUser) {
        throw new Error("An account with this email already exists.");
    }
    
    // We'll use the email as the UID for simplicity in this mock system.
    const uid = email;
    
    await createUserProfile(uid, {
        username,
        displayName: username,
        email,
    });
  };

  const logout = async () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, requestLoginOtp, verifyLoginOtp, signupWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
