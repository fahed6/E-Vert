
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Theme } from "@radix-ui/themes";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/homePage';
import ProtectedRoute from './config/auth/protectedRoute';
import  Dashboard  from './pages/DashBoard';
import UserProfile from './components/UserProfile';
import UserAddress from './components/UserAddress';


const App: React.FC = () => {
  return (
    <Theme appearance="inherit" accentColor='grass' radius='full' panelBackground='translucent' scaling="105%">
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={  <HomePage /> } />

          {/* Dashboard Layout with Nested Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="address" element={<UserAddress />} />

              {/* Add more nested routes inside dashboard */} 
          </Route>

        </Routes>
      </Layout>
    </Router>
    </Theme>
  );
};

export default App;