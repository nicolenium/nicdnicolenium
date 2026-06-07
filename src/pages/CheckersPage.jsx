
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import CheckersGamePage from './CheckersGamePage.jsx';

const CheckersPage = () => {
  const location = useLocation();
  
  // If navigated directly without setup state, redirect to setup
  if (!location.state) {
    return <Navigate to="/checkers/setup" replace />;
  }

  return <CheckersGamePage />;
};

export default CheckersPage;
