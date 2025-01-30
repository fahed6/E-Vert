import { Theme } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/homePage';
import ProtectedRoute from './config/auth/protectedRoute';


const App: React.FC = () => {
  return (
    <Theme>
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage  />} />
        <Route path="/signup" element={<SignupPage  />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </Theme>
  );
};

export default App;