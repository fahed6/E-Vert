import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, TextField, Button, Separator } from '@radix-ui/themes';

const Authentication: React.FC = () => {
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

      navigate('/home'); // Redirect to home page
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '100vh' }}>
      <Text size="6" weight="bold">Welcome back</Text>

      <Flex direction="column" gap="3" style={{ width: '300px' }}>
        <TextField.Root
          type="email"
          placeholder="Email address*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField.Root
          type="password"
          placeholder="Password*"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignIn}>Continue</Button>
      </Flex>

      <Text size="2">
        Don't have an account? <a href="/signup" style={{ color: 'blue' }}>Sign Up</a>
      </Text>

      <Flex align="center" gap="2" style={{ width: '300px' }}>
        <Separator style={{ flex: 1 }} />
        <Text size="2" color="gray">OR</Text>
        <Separator style={{ flex: 1 }} />
      </Flex>

      <Button variant="outline" onClick={handleGoogleSignIn}>
        Continue with Google
      </Button>
    </Flex>
  );
};

export default Authentication;