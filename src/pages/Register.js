import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../redux/authSlice';
import './Auth.css';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [valErr, setValErr] = useState('');
  const { loading, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => { dispatch(clearError()); }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setValErr('');
    if (form.password !== form.confirm) { setValErr('Passwords do not match'); return; }
    if (form.password.length < 6) { setValErr('Password must be at least 6 characters'); return; }
    const { confirm, ...data } = form;
    const result = await dispatch(register(data));
    if (register.fulfilled.match(result)) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">🧸 Jeunes Toys</div>
          <h2>Join the fun!</h2>
          <p>Create an account and start shopping amazing toys</p>
          <div className="auth-toys">
            <span className="toy-f" style={{animationDelay:'0s'}}>🎲</span>
            <span className="toy-f" style={{animationDelay:'.5s'}}>🪀</span>
            <span className="toy-f" style={{animationDelay:'1s'}}>🧩</span>
            <span className="toy-f" style={{animationDelay:'1.5s'}}>🌟</span>
          </div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-head"><h1>Create Account</h1><p>Join Jeunes Toys today!</p></div>
          {(error || valErr) && <div className="alert alert-error">⚠️ {valErr || error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrap"><span className="input-ico">👤</span>
                <input type="text" placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/>
              </div>
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap"><span className="input-ico">✉️</span>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/>
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap"><span className="input-ico">🔒</span>
                <input type="password" placeholder="Min. 6 characters" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required/>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrap"><span className="input-ico">🔒</span>
                <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} required/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <span className="btn-spinner"/> : '🎉 Create Account'}
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <p className="auth-switch">Have an account? <Link to="/login">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
