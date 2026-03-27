import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const VALUES = [
  {icon:'🛡️',t:'Safety First',d:'Every toy CE certified and rigorously tested.'},
  {icon:'🌈',t:'Vibrant Colors',d:'Non-toxic dyes, stimulating visual development.'},
  {icon:'🌍',t:'Made in Algeria',d:'Proudly crafted locally.'},
  {icon:'💡',t:'Educational',d:'Toys that develop skills and spark curiosity.'},
  {icon:'♻️',t:'Sustainable',d:'Eco-conscious production, recyclable plastics.'},
  {icon:'🤝',t:'Community',d:'Supporting local families, creating jobs.'},
];

const TIMELINE = [
  { 
    year: '1968',
    t: 'Foundation',
    d: 'Founded as "Samplast" in Baraki, specializing in hairdressing items and mechanical tools.' 
  },
  { 
    year: '1970s',
    t: 'Diversification',
    d: 'Expanded production into plastic household products and cups, marking a shift toward plastic manufacturing.' 
  },
  { 
    year: '1980s',
    t: 'Industrial Growth',
    d: 'Imported injection molds from Europe to expand into plastic transformation, packaging, and early toy production.' 
  },
  { 
    year: '1990s',
    t: 'Toy Development',
    d: 'Launched first toy lines including dolls, small trucks, and military toys, while improving quality with imported molds from China.' 
  },
  { 
    year: '1997',
    t: 'Rebranding',
    d: 'Renamed "Algeria Jeunes" after multiple transitions (Satep, Somaplac), continuing operations in Birtouta.' 
  },
  { 
    year: '2000s',
    t: 'Product Expansion',
    d: 'Developed higher-quality dolls, construction blocks, and seasonal toys like sand sets and balls.' 
  },
  { 
    year: 'Today',
    t: 'Established Manufacturer',
    d: 'Continues producing a wide range of plastic toys and packaging products in Birtouta, serving local and regional markets.' 
  },
  { year: 'Future', t: 'Innovation', d: 'Expanding into smart toys and digital retail across North Africa.' }
];

export default function AboutUs() {
  return (
    <div className="about-page page-wrapper">
      <section className="about-hero">
        <div className="container about-hero-inner">
          <div className="about-hero-text">
            <div className="about-badge">🇩🇿 Our Story</div>
            <h1>Crafting Joy for<br/><span>Algerian Children</span></h1>
            <p>Founded in Cité Addeche, Sidi Boukhrisse, Khraicia 16124, Algiers — Jeunes Toys is dedicated to creating safe, colorful, and educational plastic toys that grow with your child.</p>
            <Link to="/contact" className="btn btn-yellow">📍 Visit Our Factory</Link>
          </div>
          <div className="about-hero-card">
            <div style={{fontSize:80}}>🏭</div>
            <p>Cité Addeche, Sidi Boukhrisse, Khraicia 16124</p>
            <span>Est. 1968 • A legacy of plastic manufacturing and toy innovation</span>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container mission-grid">
          <div className="mission-text">
            <h2>Our Mission</h2>
            <p>At Jeunes Toys, our mission is to bring joy, creativity, and learning to every child through safe, high-quality, and affordable toys. We are committed to designing and producing products that inspire imagination, support early development, and encourage playful discovery.</p>
            <p>Rooted in our industrial heritage and expertise in plastic manufacturing, we aim to continuously innovate while maintaining the trust of families. Our goal is to make Jeunes Toys a leading name in Algeria and beyond by delivering toys that combine fun, education, and durability.</p>
            <p>We believe that every child deserves access to toys that not only entertain but also contribute to their growth and happiness.</p>
            <div className="mission-stats">
              <div><strong>500+</strong><span>Products Sold</span></div>
              <div><strong>30+</strong><span>Employees</span></div>
              <div><strong>3</strong><span>Countries</span></div>
            </div>
          </div>
          <div className="values-grid">
            {VALUES.map((v,i) => (
              <div key={i} className="value-card">
                <div className="vi">{v.icon}</div><h4>{v.t}</h4><p>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Journey 🚀</h2>
            <p className="section-subtitle">From small workshop to Algeria's favourite toy brand</p>
          </div>
          <div className="timeline">
            {TIMELINE.map((item,i) => (
              <div key={i} className={'tl-item '+(i%2===0?'left':'right')}>
                <div className="tl-content">
                  <span className="tl-year">{item.year}</span>
                  <h4>{item.t}</h4><p>{item.d}
                  </p>
                </div>
                <div className="tl-dot"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div className="container" style={{textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:18}}>🧸🚗🏀🍳</div>
          <h2>Explore Our Collection</h2>
          <p>Discover toys that spark joy, creativity, and learning.</p>
          <Link to="/" className="btn btn-primary" style={{marginTop:24}}>Shop All Toys →</Link>
        </div>
      </section>
    </div>
  );
}
