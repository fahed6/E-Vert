import { Theme } from "@radix-ui/themes";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication  from './firebase/authentication';
import '@radix-ui/themes/styles.css';
import Signup from './firebase/signup';
import HomePage from './homePage';

const App: React.FC = () => {
  return (
    <Theme>
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
    </Theme>
  );
};

export default App;