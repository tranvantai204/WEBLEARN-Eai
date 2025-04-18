import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute component to handle authentication-based routing
 * - If user has a valid token, render the children components
 * - If token is expired, log the user out and redirect to login page
 * - If no token exists, redirect to home page
 */
const ProtectedRoute = ({ children }) => {
  const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is not authenticated, redirect to home or login page
  if (!isAuthenticated) {
    // Store the current location to redirect back after login
    const redirectPath = location.pathname;
    localStorage.setItem('redirectAfterLogin', redirectPath);
    
    // Redirect to home page
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute; 