import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const handleAdd = (e) => { e.preventDefault(); e.stopPropagation(); dispatch(addToCart(product)); };
  const stars = Array.from({length:5},(_,i)=>i<Math.round(product.rating||0)?'★':'☆').join('');

  // img can be an array or a plain string (backwards compatible)
  const mainImg = Array.isArray(product.img) ? product.img[0] : product.img;
  const imgCount = Array.isArray(product.img) ? product.img.length : (product.img ? 1 : 0);

  return (
    <Link to={'/product/'+product._id} className="product-card">
      <div className="product-card-img">
        {product.isEducational && <span className="edu-badge">Educational</span>}
        {imgCount > 1 && <span className="multi-img-badge">🖼️ {imgCount}</span>}
        <img src={mainImg} alt={product.name}
          onError={e=>{e.target.src='https://placehold.co/300x300/e8f4fd/1a7fe8?text=toy';}}/>
        <div className="card-overlay">
          <button className="quick-add" onClick={handleAdd}>+ Add to Basket</button>
        </div>
      </div>
      <div className="product-card-body">
        <div className="card-meta">
          <span className="card-cat">{product.category}</span>
          {product.age_plus && <span className="card-age">{product.age_plus}+</span>}
        </div>
        <h3 className="card-name">{product.name}</h3>
        <p className="card-desc">{product.description?.length>80 ? product.description.slice(0,80)+'...' : product.description}</p>
        <div className="card-stars">{stars} <small>{(product.rating||0).toFixed(1)}</small></div>
        <div className="card-footer">
          <span className="card-price">{product.price?.toLocaleString()} <small>DA</small></span>
          <button className="btn-cart" onClick={handleAdd}>🛒</button>
        </div>
      </div>
    </Link>
  );
}
