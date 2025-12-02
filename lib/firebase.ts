// firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

let app: any = null;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MESUREMENT_ID,
    databaseURL: "https://vibely-social-media-default-rtdb.asia-southeast1.firebasedatabase.app",
  };

  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
}

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const rtdb = app ? getDatabase(app) : null;
export const storage = app ? getStorage(app) : null;

// Function to get analytics safely
export const getFirebaseAnalytics = async () => {
  if (!app || typeof window === "undefined") return null;
  if (await isSupported().catch(() => false)) {
    return getAnalytics(app);
  }
  return null;
};

export default app;
