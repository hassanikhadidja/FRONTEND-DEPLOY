import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useSelector(s => s.auth);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
