import { Button, Flex } from '@radix-ui/themes';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase-config';
import logo from '../assets/e-vert_LOGO.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('firebaseIdToken'); // Check if the user is authenticated

  const handleLogin = () => {
    navigate('/login'); // Redirect to the login page
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      localStorage.removeItem('firebaseIdToken'); // Remove the token from localStorage
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Flex align="center" justify="between" p="2" style={{ borderBottom: '1px solid #ddd' }}>
      {/* Replace "My App" with the logo image */}
      <img
        src={logo}
        alt="E-Vert Logo"
        style={{ height: '40px' }} // Adjust the height as needed
      />
      <Flex gap="3">
        {isAuthenticated ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;