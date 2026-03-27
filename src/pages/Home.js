import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/productSlice';
import ProductList from '../components/ProductList';
import './Home.css';

const DEMO = [
  { _id:"1", name:"Sand Set – Beach Adventure Kit", price:1200, description:"A cheerful set of tools for playing with sand including a sturdy bucket, shovel, rake, and fun molds for building castles.", age_plus:3, isEducational:false, category:"outdoor play", rating:4.2, stock:120, img:"https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774269482/uploads/user/1774269482786-copy_of_sand_set_beach_adventure_kit_1_fl7eir_708a54.jpg.png" },
  { _id:"2", name:"Bounce & Play Ball", price:800, description:"Lightweight, colorful plastic ball suitable for indoor and outdoor play — safe, bouncy, and easy to catch.", age_plus:2, isEducational:false, category:"outdoor play", rating:4.7, stock:320, img:"https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774270419/uploads/user/1774270419408-balls.jpg.png" },
  { _id:"3", name:"Strike Time Bowling Set", price:2500, description:"Kids bowling set with colorful pins and a fun plastic ball — great for hand-eye coordination and giggles.", age_plus:4, isEducational:true, category:"plastic toys", rating:3.6, stock:68, img:"https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774270779/uploads/user/1774270779129-kids-bowling.jpg.png" },
  { _id:"4", name:"Build & Race Car", price:3500, description:"Toy car with building blocks that can be assembled and customized — endless building possibilities.", age_plus:5, isEducational:true, category:"plastic toys", rating:4, stock:89, img:"https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774271115/uploads/user/1774271114791-lego-car.jpg.png" },
  { _id:"5", name:"Little Chef's Kitchen Set", price:3000, description:"Toy kitchen set with utensils, pots, pans, pretend food items — hours of imaginative cooking play.", age_plus:5, isEducational:true, category:"plastic toys", rating:4, stock:57, img:"https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774271824/uploads/user/1774271824751-play-kitchen.jpg.png" }];

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(s => s.products);
  useEffect(() => { dispatch(fetchAllProducts()); }, [dispatch]);
  const displayProducts = products.length > 0 ? products : DEMO;

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-shapes">
          <div className="hs hs1"/><div className="hs hs2"/><div className="hs hs3"/>
        </div>
        <div className="container hero-inner">
          <div className="hero-text">
            <div className="hero-badge">🇩🇿 Proudly Made in Algeria</div>
            <h1 className="hero-title">Where Every Child<br/><span>Discovers Joy! 🎉</span></h1>
            <p className="hero-sub">Safe, colorful, and educational plastic toys crafted with love in Algeria. Built to inspire imagination and endless fun.</p>
            <div className="hero-cta">
              <a href="#products" className="btn btn-yellow">🧸 Shop Toys</a>
              <Link to="/about" className="btn btn-outline-white">Learn More →</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>500+</strong><span>Happy Kids</span></div>
              <div className="stat-div"/>
              <div className="stat"><strong>5 ★</strong><span>Rated Products</span></div>
              <div className="stat-div"/>
              <div className="stat"><strong>100%</strong><span>Safe & Certified</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774567405/home_kqpokg.jpg" alt="hero toy" className="hero-img" onError={e=>{e.target.src='https://placehold.co/420x420/e8f4fd/1a7fe8?text=Toy';}}/>
              <div className="hbadge hb1">🌟 Age 2+</div>
              <div className="hbadge hb2">📦 Fast Delivery</div>
              <div className="hbadge hb3">🎁 Gift Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            {[
              {icon:'🛡️', t:'Safety First', d:'CE certified, rigorously tested'},
              {icon:'🌈', t:'Vibrant Colors', d:'Non-toxic, child-safe materials'},
              {icon:'🏭', t:'Made in Algeria', d:'Crafted in Cité Addeche, Sidi Boukhrisse, Khraicia, Alger'},
              {icon:'🎓', t:'Educational', d:'Spark creativity and learning'},
            ].map((f,i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div><h4>{f.t}</h4><p>{f.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Toy Collection 🧸</h2>
            <p className="section-subtitle">Discover handcrafted toys that spark wonder in every child</p>
          </div>
          {loading && <div className="spinner-wrap"><div className="spinner"/></div>}
          {error && <div className="alert alert-error">⚠️ Could not load from server — showing demo products</div>}
          {!loading && <ProductList products={displayProducts}/>}
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div className="container">
          <div className="home-cta-inner">
            <div><h2>🎁 Looking for the perfect gift?</h2><p>Our team can help you find the ideal toy for any age.</p></div>
            <div className="home-cta-btns">
              <Link to="/contact" className="btn btn-yellow">Contact Us</Link>
              <Link to="/about" className="btn btn-outline-white">Our Story</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
