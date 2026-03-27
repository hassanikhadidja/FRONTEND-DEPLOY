// src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { placeOrder, clearLastOrder, setLastOrder } from '../redux/orderSlice';
import { clearCart } from '../redux/cartSlice';
import { WILAYAS, COMMUNES, DELIVERY_CONFIG } from '../data/algeria';
import './Checkout.css';

const EMPTY_FORM = { name: '', phone: '', wilaya: '', commune: '', notes: '' };

// ── Order Success Screen ─────────────────────────────────────────
function OrderSuccess({ order, onClose }) {
  return (
    <div className="success-wrap">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h2>Order Placed!</h2>
        
        <p className="success-ref">
          Order reference: <strong>{order.orderNumber || '—'}</strong>
        </p>

        <div className="success-details">
          <div className="sd-row"><span>Customer</span><strong>{order.customerName}</strong></div>
          <div className="sd-row"><span>Phone</span><strong>{order.phone}</strong></div>
          <div className="sd-row"><span>Wilaya</span><strong>{order.wilaya}</strong></div>
          <div className="sd-row"><span>Commune</span><strong>{order.commune}</strong></div>
          <div className="sd-row"><span>Total</span><strong className="sd-total">{order.total?.toLocaleString()} DA</strong></div>
          <div className="sd-row"><span>Payment</span><strong>💵 Cash on Delivery</strong></div>
        </div>

        <div className="success-note">
          <span>📞</span>
          <p>Our team will call you to confirm your order within 24 hours.</p>
        </div>

        <div className="success-actions">
          <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const cartItems = useSelector(s => s.cart.items);
  const { placing, error, lastOrder } = useSelector(s => s.orders);
  const { user }  = useSelector(s => s.auth);

  const [form, setForm]   = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const subtotal    = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const communes    = form.wilaya ? (COMMUNES[form.wilaya] || []) : [];
  const isFreeWilaya = DELIVERY_CONFIG.FREE_WILAYAS.includes(form.wilaya);
  const isFreeByAmount = subtotal >= DELIVERY_CONFIG.FREE_THRESHOLD;
  const deliveryFee = (isFreeWilaya || isFreeByAmount) ? 0 : DELIVERY_CONFIG.STANDARD_FEE;
  const total       = subtotal + deliveryFee;

  useEffect(() => {
    if (user?.name) setForm(f => ({ ...f, name: user.name }));
  }, [user]);

  useEffect(() => () => dispatch(clearLastOrder()), [dispatch]);

  useEffect(() => {
    if (cartItems.length === 0 && !lastOrder) navigate('/');
  }, [cartItems, lastOrder, navigate]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Full name is required';
    if (!form.phone.trim())   e.phone   = 'Phone number is required';
    else if (!/^(\+213|0)[5-7][0-9]{8}$/.test(form.phone.replace(/\s/g,'')))
      e.phone = 'Enter a valid Algerian phone number (e.g. 0555 12 34 56)';
    if (!form.wilaya)         e.wilaya  = 'Please select your wilaya';
    if (!form.commune.trim()) e.commune = 'Please enter your commune';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const orderData = {
      customerName: form.name.trim(),
      phone:        form.phone.trim(),
      wilaya:       WILAYAS.find(w => w.code === form.wilaya)?.name || form.wilaya,
      commune:      form.commune.trim(),

      items: cartItems.map(item => ({
        productId: item._id,
        name:      item.name,
        price:     item.price,
        quantity:  item.quantity,
        img:       Array.isArray(item.img) ? item.img[0] : item.img,
      })),
      subtotal,
      deliveryFee,
      total,
      notes:  form.notes.trim(),
      userId: user?._id || null,
    };

    const result = await dispatch(placeOrder(orderData));

    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());

      const successOrder = {
        orderNumber: result.payload.orderId,
        customerName: form.name.trim(),
        phone:        form.phone.trim(),
        wilaya:       WILAYAS.find(w => w.code === form.wilaya)?.name || form.wilaya,
        commune:      form.commune.trim(),
        total:        total,
      };

      dispatch(setLastOrder(successOrder));
    }
  };

  const handleSuccessClose = () => {
    dispatch(clearLastOrder());
    navigate('/');
  };

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  if (lastOrder) return (
    <div className="page-wrapper">
      <div className="container">
        <OrderSuccess order={lastOrder} onClose={handleSuccessClose} />
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container checkout-wrap">
        <div className="checkout-header">
          <Link to="/" className="checkout-back">← Back to cart</Link>
          <h1 className="checkout-title">🛒 Checkout</h1>
        </div>

        <div className="checkout-grid">
          {/* LEFT: Delivery Form */}
          <div className="checkout-left">
            <div className="checkout-section">
              <h2>📦 Delivery Information</h2>
              <p className="checkout-section-sub">We'll call you to confirm your order</p>

              {error && <div className="alert alert-error">⚠️ {error}</div>}

              <form onSubmit={handleSubmit} className="checkout-form" noValidate>
                {/* Name */}
                <div className={`cf-group ${errors.name ? 'has-error' : ''}`}>
                  <label>Full Name *</label>
                  <div className="cf-input-wrap">
                    <span>👤</span>
                    <input type="text" placeholder="Ahmed Benali" value={form.name} onChange={set('name')}/>
                  </div>
                  {errors.name && <p className="cf-error">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className={`cf-group ${errors.phone ? 'has-error' : ''}`}>
                  <label>Phone Number *</label>
                  <div className="cf-input-wrap">
                    <span>📞</span>
                    <input type="tel" placeholder="0555 12 34 56" value={form.phone} onChange={set('phone')}/>
                  </div>
                  {errors.phone && <p className="cf-error">{errors.phone}</p>}
                  <small>Algerian number (0555... / 0770... / 0660...)</small>
                </div>

                {/* Wilaya */}
                <div className={`cf-group ${errors.wilaya ? 'has-error' : ''}`}>
                  <label>Wilaya *</label>
                  <div className="cf-input-wrap cf-select-wrap">
                    <span>🗺️</span>
                    <select value={form.wilaya} onChange={(e) => {
                      setForm(f => ({ ...f, wilaya: e.target.value, commune: '' }));
                      if (errors.wilaya) setErrors(er => ({ ...er, wilaya: '' }));
                    }}>
                      <option value="">— Select your wilaya —</option>
                      {WILAYAS.map(w => (
                        <option key={w.code} value={w.code}>
                          {w.code}. {w.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.wilaya && <p className="cf-error">{errors.wilaya}</p>}
                </div>

                {/* Commune */}
                <div className={`cf-group ${errors.commune ? 'has-error' : ''}`}>
                  <label>Commune *</label>
                  <div className="cf-input-wrap cf-select-wrap">
                    <span>📍</span>
                    {communes.length > 0 ? (
                      <select value={form.commune} onChange={set('commune')} disabled={!form.wilaya}>
                        <option value="">— Select your commune —</option>
                        {communes.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder={form.wilaya ? "Enter your commune" : "Select wilaya first"}
                        value={form.commune}
                        onChange={set('commune')}
                        disabled={!form.wilaya}
                      />
                    )}
                  </div>
                  {errors.commune && <p className="cf-error">{errors.commune}</p>}
                </div>

                {/* Notes */}
                <div className="cf-group">
                  <label>Additional Notes <span className="optional">(optional)</span></label>
                  <textarea
                    rows="3"
                    placeholder="E.g. building number, landmark, best time to call..."
                    value={form.notes}
                    onChange={set('notes')}
                  />
                </div>

                {/* Delivery banner */}
                <div className={`delivery-banner ${deliveryFee === 0 ? 'free' : 'paid'}`}>
                  {deliveryFee === 0 ? (
                    <>
                      <span>🚚✅</span>
                      <div>
                        <strong>Free Delivery!</strong>
                        <p>{isFreeByAmount
                          ? `Orders over ${DELIVERY_CONFIG.FREE_THRESHOLD.toLocaleString()} DA get free delivery`
                          : 'Free delivery to Alger wilaya'}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>🚚</span>
                      <div>
                        <strong>Delivery: {deliveryFee.toLocaleString()} DA</strong>
                        <p>Add <strong>{(DELIVERY_CONFIG.FREE_THRESHOLD - subtotal).toLocaleString()} DA</strong> more to get free delivery!</p>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment method */}
                <div className="payment-method-box">
                  <div className="pm-selected">
                    <span className="pm-icon">💵</span>
                    <div>
                      <strong>Cash on Delivery</strong>
                      <p>Pay when you receive your order</p>
                    </div>
                    <span className="pm-check">✓</span>
                  </div>
                  <p className="pm-note">Online payment coming soon</p>
                </div>

                <button type="submit" className="btn btn-primary checkout-submit" disabled={placing}>
                  {placing
                    ? <><span className="btn-spinner"/> Processing...</>
                    : `🎁 Place Order — ${total.toLocaleString()} DA`}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="checkout-right">
            <div className="checkout-section order-summary">
              <h2>🧸 Order Summary</h2>
              <p className="checkout-section-sub">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>

              <div className="order-items-list">
                {cartItems.map(item => {
                  const img = Array.isArray(item.img) ? item.img[0] : item.img;
                  return (
                    <div key={item._id} className="order-item">
                      <div className="order-item-img-wrap">
                        <img src={img} alt={item.name}
                          onError={e => { e.target.src = 'https://placehold.co/60x60/e8f4fd/1a7fe8?text=toy'; }}/>
                        <span className="order-item-qty">{item.quantity}</span>
                      </div>
                      <div className="order-item-info">
                        <p className="order-item-name">{item.name}</p>
                        <p className="order-item-unit">{item.price.toLocaleString()} DA each</p>
                      </div>
                      <strong className="order-item-total">
                        {(item.price * item.quantity).toLocaleString()} DA
                      </strong>
                    </div>
                  );
                })}
              </div>

              <div className="price-breakdown">
                <div className="pb-row"><span>Subtotal</span><span>{subtotal.toLocaleString()} DA</span></div>
                <div className="pb-row">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'free-label' : ''}>
                    {deliveryFee === 0 ? '🆓 Free' : `${deliveryFee.toLocaleString()} DA`}
                  </span>
                </div>
                {!isFreeByAmount && !isFreeWilaya && subtotal > 0 && (
                  <div className="free-delivery-progress">
                    <div className="fdp-bar">
                      <div className="fdp-fill" style={{ width: `${Math.min(100, (subtotal / DELIVERY_CONFIG.FREE_THRESHOLD) * 100)}%` }} />
                    </div>
                    <p>{(DELIVERY_CONFIG.FREE_THRESHOLD - subtotal).toLocaleString()} DA away from free delivery</p>
                  </div>
                )}
                <div className="pb-divider" />
                <div className="pb-row pb-total">
                  <span>Total</span>
                  <strong>{total.toLocaleString()} DA</strong>
                </div>
              </div>

              {subtotal > 0 && (
                <div className="free-delivery-notice">
                  🚚 Free delivery on orders over <strong>{DELIVERY_CONFIG.FREE_THRESHOLD.toLocaleString()} DA</strong> or to <strong>Alger wilaya</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}