import React from 'react';
import Header from './header/Header';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Header />
      <main style={{ paddingTop: '1rem' }}>{children}</main>

    </div>
  );
};

export default Layout;