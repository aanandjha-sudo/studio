
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// This is a mock user type. In a real app, this would be more detailed.
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true,
    login: () => {},
    logout: () => {},
});

const MOCK_USER_KEY = 'vivid-stream-mock-user';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedUser = localStorage.getItem(MOCK_USER_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    } catch (error) {
        console.error("Could not parse stored user", error);
        localStorage.removeItem(MOCK_USER_KEY);
    }
    setLoading(false);
  }, []);

  const login = (userData: Partial<User>) => {
    const newUser: User = {
      uid: userData.uid || `mock-uid-${Date.now()}`,
      email: userData.email || 'user@example.com',
      displayName: userData.displayName || 'Mock User',
      photoURL: userData.photoURL || `https://placehold.co/100x100.png`,
    };
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(MOCK_USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
