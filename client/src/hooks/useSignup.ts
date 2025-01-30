import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';

const useSignup = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to PostgreSQL
      const response = await fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          firstName,
          lastName,
          phoneNumber,
          email,
        }),
      });

      if (response.ok) {
        console.log("User signed up and data saved to PostgreSQL");

        // Get the ID token
        const idToken = await user.getIdToken();
        console.log("ID Token:", idToken);

        // Store the token in localStorage
        localStorage.setItem('firebaseIdToken', idToken);

        navigate('/home'); // Redirect to home page
      } else {
        console.error("Error saving user data to PostgreSQL");
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
    }
  };

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    password,
    setPassword,
    handleSignUp,
  };
};

export default useSignup;