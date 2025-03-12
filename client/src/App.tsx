
import { Theme } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AddProductForm from './components/AddProductForm';
import Layout from './components/Layout';
import UserAddress from './components/UserAddress';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './config/auth/protectedRoute';
import Dashboard from './pages/DashBoard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/homePage';
import ProductGrid from "./components/ProductGrid";
import ProductSlider from "./components/slider/ProductSlider";

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" accentColor='grass' radius='full' panelBackground='translucent' scaling="105%">
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={  <HomePage /> } />

          <Route path="/addproduct" element={<AddProductForm />} />
          <Route path="/productGrid" element={<ProductGrid  />} />
          <Route path="/ProductSlider" element={<ProductSlider  />} />

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