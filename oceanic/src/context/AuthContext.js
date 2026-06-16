"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch additional user data from Firestore with error handling
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({ ...user, ...userDoc.data() });
          } else {
            // Handle social login: Create doc if it doesn't exist
            const newUserData = {
              uid: user.uid,
              email: user.email,
              fullName: user.displayName || "Agent Alpha",
              role: "User",
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newUserData);
            setUser({ ...user, ...newUserData });
          }
        } catch (error) {
          console.warn("AuthContext: Profile sync failed:", error.message);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, fullName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      fullName,
      role: "User",
      createdAt: new Date().toISOString(),
    });
    
    return userCredential;
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const googleLogin = () => {
    return signInWithPopup(auth, new GoogleAuthProvider());
  };

  const facebookLogin = () => {
    return signInWithPopup(auth, new FacebookAuthProvider());
  };

  const microsoftLogin = () => {
    return signInWithPopup(auth, new OAuthProvider('microsoft.com'));
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup, 
      login, 
      logout, 
      googleLogin, 
      microsoftLogin, 
      resetPassword,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
