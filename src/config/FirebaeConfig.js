// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "@react-native-firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQ3UvYzpf13nQu64TUnlOlEuUk_jrOOXs",
  authDomain: "cureconnect-e3cd4.firebaseapp.com",
  projectId: "cureconnect-e3cd4",
  storageBucket: "cureconnect-e3cd4.firebasestorage.app",
  messagingSenderId: "398963194474",
  appId: "1:398963194474:web:e393be2080be1f4671a813",
  measurementId: "G-Y3JBWCBD36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);