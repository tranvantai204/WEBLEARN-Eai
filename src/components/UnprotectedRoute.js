import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * UnprotectedRoute component to handle non-authenticated routing
 * - If user is not authenticated, render the children components
 * - If user is authenticated, redirect to dashboard or saved redirect path
 */
const UnprotectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect to appropriate page
  if (isAuthenticated) {
    // Check if there's a saved redirect path
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      // Clear the saved path
      localStorage.removeItem('redirectAfterLogin');
      return <Navigate to={redirectPath} replace />;
    }
    
    // Default to progress page if no saved path
    return <Navigate to="/progress" replace />;
  }

  // If not authenticated, render the children components
  return children;
};

export default UnprotectedRoute; 