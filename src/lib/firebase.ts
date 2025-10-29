import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBEpmvg8eRQ3hAdyn0L9jyy_JbIcI2PUBE",
  authDomain: "client-mangaement.firebaseapp.com",
  projectId: "client-mangaement",
  storageBucket: "client-mangaement.firebasestorage.app",
  messagingSenderId: "334827806941",
  appId: "1:334827806941:web:86849e17e31e6930a53b34",
  measurementId: "G-J6QEK7DG07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { analytics };
