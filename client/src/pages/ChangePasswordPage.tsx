import { Button, Card, Flex, Heading, Link, Text, TextField } from '@radix-ui/themes';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { auth } from '../config/firebase-config';

import "../App.css";

const ChangePasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });


  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({
        text: 'Password reset email sent! Please check your inbox.',
        type: 'success'
      });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      setMessage({
        text: error.message || 'Failed to send password reset email.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex direction="column" gap="4" align="center" justify="center" style={{ height: '95vh' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <Flex direction="column" gap="4">
          <Heading size="5" align="center">Reset Your Password</Heading>
          
          <Text size="2" color="gray" align="center">
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <form onSubmit={handlePasswordChange}>
            <Flex direction="column" gap="3">
              <TextField.Root
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {message.text && (
                <Text 
                  size="2" 
                  color={message.type === 'success' ? 'green' : 'red'}
                  align="center"
                >
                  {message.text}
                </Text>
              )}

              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Flex>
          </form>

          <Flex justify="center">
            <Text size="2">
              Remember your password?{' '}
              <Link href="/login"> log In</Link>
            </Text>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
};

export default ChangePasswordPage;