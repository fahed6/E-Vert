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
import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import ProductDetails from "./pages/ProductDetails";
import ProductPage from "./pages/ProductPage";
import SignupPage from './pages/SignupPage';
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserOrders from "./components/UserOrders";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" accentColor='grass' radius='full' panelBackground='translucent' scaling="105%">
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="/addproduct" element={<AddProductForm />} />

            <Route path="/cart" element={<CartPage />} />

            <Route path="/checkout" element={<CheckoutPage />} />

            <Route path="/password" element={<ChangePasswordPage />} />

            {/* ProductPage with nested route for ProductDetails */}
            <Route path="/products" element={<ProductPage />}/> 
            <Route path="/products/:id" element={<ProductDetails />} />

            {/* Dashboard Layout with Nested Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="address" element={<UserAddress />} />
              <Route path="orders" element={<UserOrders />} />
              {/* Add more nested routes inside dashboard */}
            </Route>
          </Routes>
        </Layout>
      </Router>
    </Theme>
  );
};

export default App;