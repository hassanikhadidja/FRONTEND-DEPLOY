import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { removeFromCart, updateQuantity } from '../redux/cartSlice';
import './Navbar.css';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const decrement = () => {
    if (item.quantity <= 1) dispatch(removeFromCart(item._id));
    else dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }));
  };
  return (
    <div className="cart-item">
      <img src={item.img} alt={item.name} onError={e => { e.target.src = 'https://placehold.co/64x64/e8f4fd/1a7fe8?text=toy'; }} />
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-price">{item.price.toLocaleString()} DA</p>
        <div className="cart-item-qty">
          <button onClick={decrement}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}>+</button>
        </div>
      </div>
      <button className="cart-item-remove" onClick={() => dispatch(removeFromCart(item._id))}>x</button>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated, user } = useSelector(s => s.auth);
  const cartItems = useSelector(s => s.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/'); setMenuOpen(false); };

  return (
    <>
      <nav className={'navbar' + (scrolled ? ' scrolled' : '')}>
        <div className="navbar-inner">

          {/* ── Logo with car icon ── */}
          <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <img src="/car-icon.png" alt="Jeunes Toys car" className="logo-car-img" />
            <span className="logo-text">
              <span className="logo-blue">Jeunes</span>
              <span className="logo-yellow"> Toys</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <ul className="navbar-links">
            <li><NavLink to="/" end>🏠 Home</NavLink></li>
            <li><NavLink to="/about">⭐ About</NavLink></li>
            <li><NavLink to="/contact">📍 Find Us</NavLink></li>
            {isAuthenticated && isAdmin && (
              <li><NavLink to="/dashboard">🛠️ Dashboard</NavLink></li>
            )}
          </ul>

          {/* ── Right Actions ── */}
          <div className="navbar-actions">
            <button className="cart-btn" onClick={() => setCartOpen(true)}>
              🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            {isAuthenticated ? (
              <div className="user-menu">
                <span className="user-name">
                  👋 {user && user.name ? user.name : user?.email?.split('@')[0]}
                  {isAdmin && <span className="admin-chip">Admin</span>}
                </span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div className="auth-btns">
                <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
              </div>
            )}
            <button className="menu-toggle" onClick={() => setMenuOpen(o => !o)}>{menuOpen ? 'X' : '='}</button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div className={'mobile-menu' + (menuOpen ? ' open' : '')}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>🏠 Home</NavLink>
          <NavLink to="/about" onClick={() => setMenuOpen(false)}>⭐ About Us</NavLink>
          <NavLink to="/contact" onClick={() => setMenuOpen(false)}>📍 Find Us</NavLink>
          {isAuthenticated && isAdmin && (
            <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>🛠️ Dashboard</NavLink>
          )}
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
            </>
          ) : (
            <button className="mobile-logout" onClick={handleLogout}>Logout</button>
          )}
        </div>
      </nav>

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <div className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>🛒 Your Basket</h2>
              <button onClick={() => setCartOpen(false)}>X</button>
            </div>
            {cartItems.length === 0 ? (
              <div className="cart-empty">
                <div style={{fontSize:64}}>🧸</div>
                <p>Your basket is empty!</p>
                <button className="btn btn-primary" onClick={() => setCartOpen(false)}>Shop Now</button>
              </div>
            ) : (
              <>
                <div className="cart-items">{cartItems.map(item => <CartItem key={item._id} item={item} />)}</div>
                <div className="cart-footer">
                  <div className="cart-total"><span>Total:</span><strong>{cartTotal.toLocaleString()} DA</strong></div>
                  <button className="btn btn-yellow" style={{width:'100%',justifyContent:'center'}} onClick={() => { setCartOpen(false); navigate('/checkout'); }}>🎁 Checkout — {cartTotal.toLocaleString()} DA</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
