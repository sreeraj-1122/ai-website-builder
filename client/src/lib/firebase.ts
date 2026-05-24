import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-607bb.firebaseapp.com",
  projectId: "genwebai-607bb",
  storageBucket: "genwebai-607bb.firebasestorage.app",
  messagingSenderId: "367202720977",
  appId: "1:367202720977:web:c8188599bd4e2ba09756b1",
  measurementId: "G-GMDG8X5J4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
