import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPpJtSgI0fmhzGewyqV0HSKykUxe7mzKw",
  authDomain: "first-firebase2025-e7cd0.firebaseapp.com",
  projectId: "first-firebase2025-e7cd0",
  storageBucket: "first-firebase2025-e7cd0.firebasestorage.app",
  messagingSenderId: "148765976691",
  appId: "1:148765976691:web:a6c56046e9b9e883b82206"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
