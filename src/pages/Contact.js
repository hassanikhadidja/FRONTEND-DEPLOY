import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); setForm({ name:'', email:'', phone:'', subject:'', message:'' }); }, 1200);
  };

  return (
    <div className="contact-page page-wrapper">
      <div className="contact-hero">
        <div className="container"><h1>📍 Find Us</h1><p>We would love to hear from you! Stop by our factory or send us a message.</p></div>
      </div>
      <div className="container contact-body">
        <div className="ci-row">
          {[
            {icon:'📍',label:'Address',val:'Cité Addeche, Sidi Boukhrisse, Khraicia 16124'},
            {icon:'📞',label:'Phone',val:'+213 672 43 28 33\n+213 770 29 28 16'},
            {icon:'✉️',label:'Email',val:'jeunestoys@gmail.com'},
            {icon:'🕘',label:'Hours',val:'Sam – Jeu: 8h00 – 17h00'},
          ].map((c,i) => (
            <div key={i} className="ci-card">
              <div className="ci-ico">{c.icon}</div>
              <div><h4>{c.label}</h4><p>{c.val.split('\n').map((l,j)=><span key={j}>{l}<br/></span>)}</p></div>
            </div>
          ))}
        </div>
        <div className="contact-grid">
          <div className="contact-form-card">
            <h2>✉️ Send us a Message</h2>
            <p className="form-hint">We usually reply within 24 hours</p>
            {sent ? (
              <div className="sent-msg">
                <div style={{fontSize:60,animation:'float 2s ease-in-out infinite'}}>🎉</div>
                <h3>Message Sent!</h3>
                <p>Thank you! We will get back to you soon.</p>
                <button className="btn btn-primary" onClick={()=>setSent(false)}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="c-form">
                <div className="c-row">
                  <div className="form-group"><label>Your Name *</label><input type="text" placeholder="Ahmed Benali" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required/></div>
                  <div className="form-group"><label>Email *</label><input type="email" placeholder="ahmed@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required/></div>
                </div>
                <div className="c-row">
                  <div className="form-group"><label>Phone</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
                  <div className="form-group"><label>Subject *</label>
                    <select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))} required>
                      <option value="">Select a topic</option>
                      <option value="order">Order Inquiry</option>
                      <option value="product">Product Info</option>
                      <option value="wholesale">Wholesale / B2B</option>
                      <option value="factory">Factory Visit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Message *</label><textarea rows="5" placeholder="Tell us how we can help..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required/></div>
                <button type="submit" className="btn btn-primary c-submit" disabled={loading}>
                  {loading ? <><span className="btn-spinner"/> Sending...</> : '🚀 Send Message'}
                </button>
              </form>
            )}
          </div>
          <div className="map-card">
            <h2>🗺️ Our Location</h2>
            <p>Cité Addeche, Sidi Boukhrisse, Khraicia 16124</p>
            <div className="map-wrap">
              <iframe
                title="Jeunes Toys Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3200.846855065089!2d2.9864856000000004!3d36.6541347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fa9bb2c3452ed%3A0x8bf2961c93c8180!2sSNC%20ALGERIA%20JEUNES!5e0!3m2!1sfr!2sdz!4v1774570390913!5m2!1sfr!2sdz"
                width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href="https://maps.app.goo.gl/x5qnsX44ACABbjyJ8" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{marginTop:14,justifyContent:'center',width:'100%'}}>🧭 Get Directions</a>
          </div>
        </div>
      </div>
    </div>
  );
}
