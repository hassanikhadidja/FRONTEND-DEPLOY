import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/authSlice';
import './Auth.css';

export default function Login() {
  const [form, setForm] = useState({ email:'', password:'' });
  const { loading, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">🧸 Jeunes Toys</div>
          <h2>Welcome back!</h2>
          <p>Sign in to manage your toys and orders</p>
          <div className="auth-toys">
            <span className="toy-f" style={{animationDelay:'0s'}}>🚗</span>
            <span className="toy-f" style={{animationDelay:'.5s'}}>🏀</span>
            <span className="toy-f" style={{animationDelay:'1s'}}>🍳</span>
            <span className="toy-f" style={{animationDelay:'1.5s'}}>⭐</span>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-head"><h1>Sign In</h1><p>Access your Jeunes Toys account</p></div>
          {error && <div className="alert alert-error">⚠️ {error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <span className="input-ico">✉️</span>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required autoComplete="email"/>
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <span className="input-ico">🔒</span>
                <input type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required autoComplete="current-password"/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner"/> : '🚀 Sign In'}
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-switch">No account? <Link to="/register">Create one →</Link></p>
          
        </div>
      </div>
    </div>
  );
}
