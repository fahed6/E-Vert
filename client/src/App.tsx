import { Theme } from "@radix-ui/themes";
import '@radix-ui/themes/styles.css';
import React from 'react';
import { Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminProductsContent from "./components/adminComponents/adminProductsContent";
import AdminUserEdit from "./components/adminComponents/AdminUserEdit";
import AdminUserOrders from "./components/adminComponents/AdminUserOrders";
import Layout from './components/Layout';
import AdminDashboard from "./components/panel/AdminDashboard";
import { AdminLayout } from "./components/panel/AdminLayout";
import ProtectedRoute from './config/auth/protectedRoute';
import CartPage from "./pages/CartPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from './pages/homePage';
import LoginPage from './pages/LoginPage';
import OrderDetail from "./pages/OrderDetail";
import ProductDetails from "./pages/ProductDetails";
import ProductPage from "./pages/ProductPage";
import Profile from "./pages/Profile";
import SignupPage from './pages/SignupPage';
import AdminOrderDetail from "./components/adminComponents/AdminOrderDetail";
import PartnerDashboard from "./components/panel/partner/PartnerDashboard";

const App: React.FC = () => {
  return (
    <Theme appearance="inherit" accentColor='grass' radius='full' panelBackground='translucent' scaling="105%">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          
          {/* Main layout routes (with header) */}
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductPage />}/>
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />
              
            </Route>
          </Route>
          
          {/* Admin route with its own layout (no header) */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route 
              path="/AdminDashboard" 
              element={
                <AdminLayout>
                  <AdminDashboard />
                  
                </AdminLayout>
                
              } 
            />
            <Route path="/AdminDashboard/users/edit/:userId" element={<AdminLayout><AdminUserEdit /></AdminLayout>} />
            <Route path="/AdminDashboard/users/orders/:userId" element={<AdminLayout><AdminUserOrders /></AdminLayout>} />
            <Route path="/AdminDashboard/partners/products/:ownerId" element={<AdminLayout><AdminProductsContent /></AdminLayout>} />
            <Route path="/AdminDashboard/user/order/:orderId" element={<AdminLayout><AdminOrderDetail /></AdminLayout>} />

            <Route path="/PartnerDashboard" element={<AdminLayout><PartnerDashboard /></AdminLayout>} /> 
          </Route>
        </Routes>
      </Router>
    </Theme>
  );
};

export default App;