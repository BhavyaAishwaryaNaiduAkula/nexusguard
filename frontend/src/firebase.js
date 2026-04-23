import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

/**
 * Executes a Google Single Sign-On via redirect.
 * This is more reliable on production domains as it bypasses popup blockers.
 */
export const signInWithGoogle = () => {
  return signInWithRedirect(auth, provider);
};

export { getRedirectResult };
