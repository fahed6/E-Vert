import React from 'react';
import { Flex, Text, TextField, Button } from '@radix-ui/themes';
import useSignup from '../hooks/useSignup';
import "../App.css";

const SignupPage: React.FC = () => {
  const {
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
  } = useSignup();

  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '80vh' }}>
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
        Already have an account? <a href="/login" className="link">Log In</a>
      </Text>
    </Flex>
  );
};

export default SignupPage;