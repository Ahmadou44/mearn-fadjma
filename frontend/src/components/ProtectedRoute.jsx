import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  return Boolean(localStorage.getItem('fadjma_token'));
};

export default function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
