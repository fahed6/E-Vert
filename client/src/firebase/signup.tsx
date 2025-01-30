import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { Flex, Text, TextField, Button } from '@radix-ui/themes';

const Signup: React.FC = () => {
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
        navigate('/home'); // Redirect to home page
      } else {
        console.error("Error saving user data to PostgreSQL");
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
    }
  };

  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '100vh' }}>
      <Text size="6" weight="bold">Sign Up</Text>

      <Flex direction="column" gap="3" style={{ width: '300px' }}>
        <TextField.Root
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField.Root
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextField.Root
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <TextField.Root
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField.Root
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSignUp}>Sign Up</Button>
      </Flex>

      <Text size="2">
        Already have an account? <a href="/login" style={{ color: 'blue' }}>Log In</a>
      </Text>
    </Flex>
  );
};

export default Signup;