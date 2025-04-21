// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // 👈 importá auth

const firebaseConfig = {
  apiKey: "AIzaSyAZ6Nke4Xcywarw-nhmNxeO7jnL8gF-EFo",
  authDomain: "wavy-carpets.firebaseapp.com",
  databaseURL: "https://wavy-carpets-default-rtdb.firebaseio.com",
  projectId: "wavy-carpets",
  storageBucket: "wavy-carpets.firebasestorage.app",
  messagingSenderId: "857289802349",
  appId: "1:857289802349:web:f0b8d2eb8ebfcd10677564",
  measurementId: "G-V0HCXMK2QC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app); // 👈 exportá auth
