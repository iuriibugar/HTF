// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBREo7YpHmycRgjyftoxkiFMLwMVePqeKc",
  authDomain: "happy-tri-friends.firebaseapp.com",
  databaseURL: "https://happy-tri-friends-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "happy-tri-friends",
  storageBucket: "happy-tri-friends.firebasestorage.app",
  messagingSenderId: "442257914194",
  appId: "1:442257914194:web:bf5e1c5cb21cac78e5e28b",
  measurementId: "G-RV9XDZH7J9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export auth, googleProvider, and Firestore
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);
export const storage = getStorage(app);