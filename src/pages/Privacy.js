import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

export default function Privacy() {
  return (
    <div className="page-wrapper">
      <div className="legal-hero">
        <div className="container">
          <div className="legal-hero-icon">🔒</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: March 2026</p>
        </div>
      </div>
      <div className="container legal-body">
        <div className="legal-sidebar">
          <div className="toc-card">
            <h3>Contents</h3>
            <ul>
              <li><a href="#collect">1. Data We Collect</a></li>
              <li><a href="#use">2. How We Use It</a></li>
              <li><a href="#cookies">3. Cookies</a></li>
              <li><a href="#sharing">4. Data Sharing</a></li>
              <li><a href="#rights">5. Your Rights</a></li>
              <li><a href="#security">6. Security</a></li>
              <li><a href="#children">7. Children's Privacy</a></li>
              <li><a href="#contact">8. Contact Us</a></li>
            </ul>
          </div>
          <div className="legal-badge">
            <div>🛡️</div>
            <p>Your data is safe with us. We never sell your personal information.</p>
          </div>
        </div>

        <div className="legal-content">
          <div className="legal-intro">
            <p>At <strong>Jeunes Toys</strong>, your privacy is a top priority. This policy explains what information we collect, how we use it, and how we protect it when you visit our website or purchase our toys.</p>
          </div>

          <section id="collect" className="legal-section">
            <h2><span className="legal-num">1</span> Data We Collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account.</li>
              <li><strong>Order Information:</strong> Shipping address, phone number, and payment details for processing orders.</li>
              <li><strong>Contact Information:</strong> Any data you submit through our contact form.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on site, and browser type — collected automatically.</li>
            </ul>
          </section>

          <section id="use" className="legal-section">
            <h2><span className="legal-num">2</span> How We Use Your Data</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your toy orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your questions and support requests</li>
              <li>Improve our website and product offerings</li>
              <li>Send promotional emails (only with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section id="cookies" className="legal-section">
            <h2><span className="legal-num">3</span> Cookies</h2>
            <p>We use cookies to enhance your browsing experience. These include:</p>
            <div className="cookie-table">
              <div className="ct-row ct-head">
                <span>Cookie Type</span><span>Purpose</span><span>Duration</span>
              </div>
              <div className="ct-row">
                <span>Essential</span><span>Shopping cart, login session</span><span>Session</span>
              </div>
              <div className="ct-row">
                <span>Analytics</span><span>Understanding site usage</span><span>12 months</span>
              </div>
              <div className="ct-row">
                <span>Preferences</span><span>Remember your settings</span><span>6 months</span>
              </div>
            </div>
            <p>You can disable cookies in your browser settings, though some features may not work correctly.</p>
          </section>

          <section id="sharing" className="legal-section">
            <h2><span className="legal-num">4</span> Data Sharing</h2>
            <p>We do <strong>not sell</strong> your personal data. We may share it only with:</p>
            <ul>
              <li><strong>Delivery Partners:</strong> To ship your orders across Algeria.</li>
              <li><strong>Payment Processors:</strong> To securely handle transactions.</li>
              <li><strong>Legal Authorities:</strong> When required by Algerian law.</li>
            </ul>
          </section>

          <section id="rights" className="legal-section">
            <h2><span className="legal-num">5</span> Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of marketing communications at any time</li>
            </ul>
            <p>To exercise these rights, contact us at <strong>jeunestoys@gmail.com</strong></p>
          </section>

          <section id="security" className="legal-section">
            <h2><span className="legal-num">6</span> Security</h2>
            <p>We use industry-standard measures including SSL encryption, secure servers, and regular security audits to protect your data. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section id="children" className="legal-section">
            <h2><span className="legal-num">7</span> Children's Privacy</h2>
            <p>Our website is intended for adults making purchases for children. We do not knowingly collect personal data from children under 13. If you believe a child has submitted personal information, please contact us immediately.</p>
          </section>

          <section id="contact" className="legal-section">
            <h2><span className="legal-num">8</span> Contact Us</h2>
            <div className="legal-contact-box">
              <p>📍 Cité Addeche, Sidi Boukhrisse, Khraicia 16124</p>
              <p>✉️ jeunestoys@gmail.com</p>
              <p>📞 +213 672 43 28 33</p>
              <Link to="/contact" className="btn btn-primary" style={{marginTop:14,display:'inline-flex'}}>Send a Message</Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
