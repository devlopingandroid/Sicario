import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBOAtBQMdyJQXLn35Ze1r9SmDzEHmX_Xt8",
  authDomain: "sicario-bc60b.firebaseapp.com",
  projectId: "sicario-bc60b",
  storageBucket: "sicario-bc60b.firebasestorage.app",
  messagingSenderId: "155244525209",
  appId: "1:155244525209:web:759746e1eb1e83dbf2aa08",
  measurementId: "G-03ZB3G7FGX"
};

// 1️⃣ Initialize app FIRST
const app = initializeApp(firebaseConfig);

// 2️⃣ Then use app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
