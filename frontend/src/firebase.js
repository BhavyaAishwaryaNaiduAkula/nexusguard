import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

/**
 * NEXUSGUARD PRODUCTION FIREBASE CONFIGURATION
 * Project: flutter-ai-playground-3908e
 */

const firebaseConfig = {
  apiKey: "AIzaSyAX6Mq38PdPaHtVGoJklgHEn1Jmcp6mD68",
  authDomain: "flutter-ai-playground-3908e.firebaseapp.com",
  projectId: "flutter-ai-playground-3908e",
  storageBucket: "flutter-ai-playground-3908e.firebasestorage.app",
  messagingSenderId: "730829625829",
  appId: "1:730829625829:web:57144f1e04025e7503770c"
};

// Debug Log for verification
console.log("Firebase API Key:", firebaseConfig.apiKey);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

/**
 * Executes a Google Single Sign-On popup.
 * Returns the authenticated user object on success.
 */
export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
