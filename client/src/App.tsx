
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Theme } from "@radix-ui/themes";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/homePage';
import ProtectedRoute from './config/auth/protectedRoute';


const App: React.FC = () => {
  return (
    <Theme accentColor='grass' radius='large' panelBackground='translucent' scaling="100%">
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={ <ProtectedRoute> <HomePage /> </ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
    </Theme>
  );
};

export default App;