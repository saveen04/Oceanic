// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxdoSxjcfdqW0a04NOAr9zmj8sIl7vwhk",
  authDomain: "oceanic-app-68b60.firebaseapp.com",
  projectId: "oceanic-app-68b60",
  storageBucket: "oceanic-app-68b60.firebasestorage.app",
  messagingSenderId: "1089881709947",
  appId: "1:1089881709947:web:b7e2bedd60e7d41a66b1de",
  measurementId: "G-1VKS7GGKJ2"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is only supported in the browser
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, storage, analytics };
