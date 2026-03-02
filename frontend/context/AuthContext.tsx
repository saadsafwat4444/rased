"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { auth } from '../firebase/firebase-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await getIdTokenResult(firebaseUser, true);
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: tokenResult.claims.role });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}