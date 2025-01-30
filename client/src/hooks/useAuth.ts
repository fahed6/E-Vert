import { useState } from 'react';
import {  signInWithEmailAndPassword, signInWithPopup} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSignIn = async (): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);

      // Get the ID token
      const idToken = await userCredential.user.getIdToken();
      console.log("ID Token:", idToken);

      // Store the token in localStorage
      localStorage.setItem('firebaseIdToken', idToken);

      navigate('/home'); // Redirect to home page
    } catch (error: any) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in with Google:", result.user);

      // Get the ID token
      const idToken = await result.user.getIdToken();
      console.log("ID Token:", idToken);

      // Store the token in localStorage
      localStorage.setItem('firebaseIdToken', idToken);

      navigate('/home'); // Redirect to home page
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleGoogleSignIn,
  };
};

export default useAuth;