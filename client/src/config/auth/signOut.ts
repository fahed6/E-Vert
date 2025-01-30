import { signOut } from "firebase/auth";
import { auth } from '../firebase-config';

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('firebaseIdToken'); // Clear the token
    console.log("User signed out");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};