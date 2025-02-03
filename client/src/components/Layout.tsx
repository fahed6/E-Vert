import React from 'react';
import Header from './Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ padding: '1rem' }}>{children}</main>
    </div>
  );
};

export default Layout;