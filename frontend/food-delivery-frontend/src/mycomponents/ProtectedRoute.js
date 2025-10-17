import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');

  if (!token || role !== allowedRole) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
