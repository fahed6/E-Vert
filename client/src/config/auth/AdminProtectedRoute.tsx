// src/components/AdminProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAdmin } from '../../hooks/checkAdmin';

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      const adminStatus = await checkAdmin();
      setIsAdmin(adminStatus);
    };

    verifyAdmin();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />; 
  }

  return <>{children}</>; 
};

export default AdminProtectedRoute;