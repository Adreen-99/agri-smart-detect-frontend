import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { auth } from '../../context/utils/auth';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const token = auth.getToken();

  return (currentUser && token) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;