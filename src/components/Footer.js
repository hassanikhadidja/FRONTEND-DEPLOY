import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Footer.css';

export default function Footer() {
  const { isAuthenticated } = useSelector(s => s.auth);
  return (
    <footer className="footer">
      <div className="footer-body">
        <div className="container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo"><span className="fl-blue">Jeunes</span> <span className="fl-yellow">Toys</span> 🧸</div>
            <p className="footer-tagline">Safe, Fun & Colorful Plastic Toys for Children<br/>Made with love in Algeria 🇩🇿</p>
            <div className="footer-socials">
              <a href="#void" className="fsoc">f</a>
              <a href="#void" className="fsoc">in</a>
              <a href="#void" className="fsoc">yt</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">🏠 Home</Link></li>
              <li><Link to="/about">⭐ About Us</Link></li>
              <li><Link to="/contact">📍 Find Us</Link></li>
              {isAuthenticated && <li><Link to="/dashboard">🛠️ Dashboard</Link></li>}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">🔑 Login</Link></li>
              <li><Link to="/register">✨ Sign Up</Link></li>
              <li><Link to="/contact">💬 Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/privacy">🔒 Privacy Policy</Link></li>
              <li><Link to="/terms">📋 Terms & Conditions</Link></li>
            </ul>
            <h4 style={{marginTop:20}}>Visit Us</h4>
            <ul className="footer-contact">
              <li>📍 Cité Addeche, Sidi Boukhrisse, Khraicia 16124</li>
              <li>✉️ jeunestoys@gmail.com</li>
              <li>📞 +213 672 43 28 33</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Jeunes Toys. Tous droits réservés.</p>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
