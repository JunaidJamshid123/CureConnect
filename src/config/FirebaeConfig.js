// config/FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import {
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQ3UvYzpf13nQu64TUnlOlEuUk_jrOOXs",
  authDomain: "cureconnect-e3cd4.firebaseapp.com",
  projectId: "cureconnect-e3cd4",
  storageBucket: "cureconnect-e3cd4.appspot.com", // ✅ fixed this too
  messagingSenderId: "398963194474",
  appId: "1:398963194474:web:e393be2080be1f4671a813",
  measurementId: "G-Y3JBWCBD36"
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
