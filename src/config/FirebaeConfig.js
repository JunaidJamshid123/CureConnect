// config/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC1hhuAPn8VR37Tjz6Kpo0pv7-Fmu49g84",
  authDomain: "cureconnect-b1870.firebaseapp.com",
  projectId: "cureconnect-b1870",
  storageBucket: "cureconnect-b1870.firebasestorage.app",
  messagingSenderId: "1055909963829",
  appId: "1:1055909963829:web:aa0f92e6898832c665e97c",
  measurementId: "G-2NZ6CKZYWG"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth with AsyncStorage for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// ✅ Firestore
const db = getFirestore(app);

export { auth, db };
