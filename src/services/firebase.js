import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseKey } from '@env';

const firebaseConfig = {
  apiKey: FirebaseKey,
  authDomain: "uberclone-18296.firebaseapp.com",
  projectId: "uberclone-18296",
  storageBucket: "uberclone-18296.firebasestorage.app",
  messagingSenderId: "575758149429",
  appId: "1:575758149429:web:f5bd7d00bd59aa6cfb0e7c"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});