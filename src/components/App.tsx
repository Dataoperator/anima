import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { MotionProvider } from '@/providers/MotionProvider';
import RootLayout from './layout/RootLayout';

const App: React.FC = () => {
  return (
    <Router>
      <MotionProvider>
        <RootLayout />
      </MotionProvider>
    </Router>
  );
};

export default App;