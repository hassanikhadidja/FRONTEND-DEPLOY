import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

export default function Terms() {
  return (
    <div className="page-wrapper">
      <div className="legal-hero legal-hero-yellow">
        <div className="container">
          <div className="legal-hero-icon">📋</div>
          <h1>Terms & Conditions</h1>
          <p>Last updated: March 2026</p>
        </div>
      </div>
      <div className="container legal-body">
        <div className="legal-sidebar">
          <div className="toc-card">
            <h3>Contents</h3>
            <ul>
              <li><a href="#acceptance">1. Acceptance</a></li>
              <li><a href="#products">2. Products</a></li>
              <li><a href="#orders">3. Orders & Payment</a></li>
              <li><a href="#delivery">4. Delivery</a></li>
              <li><a href="#returns">5. Returns & Refunds</a></li>
              <li><a href="#account">6. Your Account</a></li>
              <li><a href="#ip">7. Intellectual Property</a></li>
              <li><a href="#liability">8. Liability</a></li>
              <li><a href="#law">9. Governing Law</a></li>
            </ul>
          </div>
          <div className="legal-badge legal-badge-yellow">
            <div>⚖️</div>
            <p>By using our site you agree to these terms. Questions? Contact us anytime.</p>
          </div>
        </div>

        <div className="legal-content">
          <div className="legal-intro">
            <p>Welcome to <strong>Jeunes Toys</strong>. By accessing or using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase.</p>
          </div>

          <section id="acceptance" className="legal-section">
            <h2><span className="legal-num">1</span> Acceptance of Terms</h2>
            <p>By visiting our website, creating an account, or placing an order, you confirm that you are at least 18 years old and legally able to enter into a binding agreement under Algerian law. If you do not agree with these terms, please do not use our service.</p>
          </section>

          <section id="products" className="legal-section">
            <h2><span className="legal-num">2</span> Products & Descriptions</h2>
            <p>We make every effort to display our toy products as accurately as possible. However:</p>
            <ul>
              <li>Product images are for illustration purposes; actual colors may vary slightly.</li>
              <li>All prices are displayed in Algerian Dinars (DA) and include applicable taxes.</li>
              <li>We reserve the right to modify or discontinue any product without notice.</li>
              <li>Stock availability is not guaranteed until your order is confirmed.</li>
            </ul>
          </section>

          <section id="orders" className="legal-section">
            <h2><span className="legal-num">3</span> Orders & Payment</h2>
            <p>When you place an order:</p>
            <ul>
              <li>You will receive an email confirmation with your order details.</li>
              <li>We reserve the right to refuse or cancel any order at our discretion.</li>
              <li>Payment must be completed before items are dispatched.</li>
              <li>All transactions are processed securely — we do not store full payment details.</li>
            </ul>
            <div className="legal-highlight">
              <strong>⚠️ Fraud Prevention:</strong> Orders suspected of fraud will be cancelled and reported to relevant authorities.
            </div>
          </section>

          <section id="delivery" className="legal-section">
            <h2><span className="legal-num">4</span> Delivery</h2>
            <ul>
              <li>We deliver across Algeria. Delivery times vary by wilaya (3–7 business days).</li>
              <li>Delivery fees are calculated at checkout based on your location.</li>
              <li>We are not responsible for delays caused by third-party delivery services.</li>
              <li>Risk of loss passes to you upon delivery of the goods.</li>
            </ul>
          </section>

          <section id="returns" className="legal-section">
            <h2><span className="legal-num">5</span> Returns & Refunds</h2>
            <p>We want you to be completely happy with your purchase:</p>
            <ul>
              <li><strong>Return Window:</strong> Items may be returned within 14 days of delivery.</li>
              <li><strong>Condition:</strong> Products must be unused, in original packaging.</li>
              <li><strong>Damaged Goods:</strong> Report damaged items within 48 hours with photos.</li>
              <li><strong>Refunds:</strong> Processed within 5–10 business days of receiving the return.</li>
              <li><strong>Exclusions:</strong> Hygiene items and customized products cannot be returned.</li>
            </ul>
          </section>

          <section id="account" className="legal-section">
            <h2><span className="legal-num">6</span> Your Account</h2>
            <p>If you create an account with us:</p>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your password.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to terminate accounts that violate these terms.</li>
              <li>One account per person — duplicate accounts may be removed.</li>
            </ul>
          </section>

          <section id="ip" className="legal-section">
            <h2><span className="legal-num">7</span> Intellectual Property</h2>
            <p>All content on this website — including logos, images, text, and product designs — is the exclusive property of Jeunes Toys. You may not copy, reproduce, or distribute any content without our written permission.</p>
          </section>

          <section id="liability" className="legal-section">
            <h2><span className="legal-num">8</span> Limitation of Liability</h2>
            <p>Jeunes Toys shall not be liable for any indirect, incidental, or consequential damages arising from your use of our products or website. Our liability is limited to the purchase price of the product in question.</p>
            <div className="legal-highlight">
              <strong>🧸 Safety Notice:</strong> Always supervise children while playing. Check age recommendations on each product. Keep small parts away from children under 3.
            </div>
          </section>

          <section id="law" className="legal-section">
            <h2><span className="legal-num">9</span> Governing Law</h2>
            <p>These terms are governed by the laws of the People's Democratic Republic of Algeria. Any disputes shall be subject to the exclusive jurisdiction of the courts of Algiers.</p>
            <p>We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with the updated date.</p>
            <div className="legal-contact-box">
              <p><strong>Questions about these terms?</strong></p>
              <p>✉️ jeunestoys@gmail.com</p>
              <Link to="/contact" className="btn btn-primary" style={{marginTop:14,display:'inline-flex'}}>Contact Us</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
