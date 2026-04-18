import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEoLkDWtcsDa_vO8NtqLEx9_c4CNrtZvA",
  authDomain: "fast-and-furious-hub-10af0.firebaseapp.com",
  projectId: "fast-and-furious-hub-10af0",
  storageBucket: "fast-and-furious-hub-10af0.firebasestorage.app",
  messagingSenderId: "419283184808",
  appId: "1:419283184808:web:4ad27b07d7337dd6ba269d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export { collection, doc, getDoc, getDocs, setDoc, addDoc, deleteDoc, updateDoc, onSnapshot, query, orderBy, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged };
