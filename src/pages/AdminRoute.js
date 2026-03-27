import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// AdminRoute — requires login + role === 'admin'
export default function AdminRoute({ children }) {
  const { isAuthenticated, user } = useSelector(s => s.auth);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role !== 'admin') {
    return (
      <div className="page-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{textAlign:'center',padding:'80px 20px'}}>
          <div style={{fontSize:64}}>🚫</div>
          <h2 style={{fontFamily:'var(--font-head)',fontSize:28,margin:'16px 0 10px'}}>Access Denied</h2>
          <p style={{color:'var(--text-muted)',marginBottom:24}}>This page is for admins only.</p>
          <a href="/" className="btn btn-primary">Go to Home</a>
        </div>
      </div>
    );
  }

  return children;
}
