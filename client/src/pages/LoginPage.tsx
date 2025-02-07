import React from 'react';
import { Flex, Text, TextField, Button, Separator, Link } from '@radix-ui/themes';
import useAuth from '../hooks/useAuth';
import "../App.css";


const LoginPage: React.FC = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleGoogleSignIn,
  } = useAuth();

  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '95vh' }}>
      <Text size="6" weight="bold">Welcome back !</Text>

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
        Don't have an account? <Link href="/signup">Sign Up </Link>
      </Text>

      <Flex align="center" gap="2" style={{ width: '300px' }}>
        <Separator style={{ flex: 1 }} />
        <Text size="2" color="gray">OR</Text>
        <Separator style={{ flex: 1 }} />
      </Flex>

      <Button variant="outline" onClick={handleGoogleSignIn}>
        Continue with Google
      </Button>

      <Button variant="outline" onClick={handleGoogleSignIn}>
        Continue with Google
      </Button>
    </Flex>
  );
};

export default LoginPage;