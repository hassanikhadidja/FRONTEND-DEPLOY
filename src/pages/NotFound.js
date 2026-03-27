import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-wrapper" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{textAlign:'center',padding:'80px 20px'}}>
        <div style={{fontSize:64,animation:'float 3s ease-in-out infinite',display:'block',marginBottom:12}}>🧸</div>
        <h1 style={{fontFamily:'var(--font-head)',fontSize:110,color:'var(--blue)',lineHeight:1}}>404</h1>
        <h2 style={{fontFamily:'var(--font-head)',fontSize:28,marginBottom:12}}>This page ran away!</h2>
        <p style={{color:'var(--text-muted)',marginBottom:28}}>Looks like this toy escaped our shelves.</p>
        <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/" className="btn btn-primary">🏠 Back to Home</Link>
          <Link to="/contact" className="btn btn-outline">💬 Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
