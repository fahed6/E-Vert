import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/firebase-config';


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

      // Extract user information
      const user = result.user;
      const userData = {
        uid: user.uid,
        email: user.email || '', // Use an empty string if email is null
        firstName: user.displayName?.split(' ')[0] || '', // Extract first name from displayName
        lastName: user.displayName?.split(' ')[1] || '', // Extract last name from displayName
        phoneNumber: '', // Google sign-in doesn't provide phone number
        isActive: true,
        role: 'user', // Default role for Google sign-in users
      };

      // Send user data to the backend to create a user object
      const response = await fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User object created in the database");
      } else {
        console.error("Error creating user object in the database");
      }

      navigate('/home'); // Redirect to home page
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem('firebaseIdToken'); // Remove the token from localStorage
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleGoogleSignIn,
    handleLogout,
  };
};

export default useAuth;