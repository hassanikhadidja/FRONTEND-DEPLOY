import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct, fetchAllProducts } from '../redux/productSlice';
import { addToCart } from '../redux/cartSlice';
import './ProductDetails.css';

const DEMO = [
  { _id:"1", name:"Sand Set – Beach Adventure Kit", price:1200, description:"A cheerful set of tools for playing with sand including a sturdy bucket, shovel, rake, and fun molds for building castles.", age_plus:3, isEducational:false, category:"outdoor play", rating:4.2, stock:120, img:["https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774269482/uploads/user/1774269482786-copy_of_sand_set_beach_adventure_kit_1_fl7eir_708a54.jpg.png"] },
  { _id:"2", name:"Bounce & Play Ball", price:800, description:"Lightweight, colorful plastic ball suitable for indoor and outdoor play — safe, bouncy, and easy to catch.", age_plus:2, isEducational:false, category:"outdoor play", rating:4.7, stock:320, img:["https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774270419/uploads/user/1774270419408-balls.jpg.png"] },
  { _id:"3", name:"Strike Time Bowling Set", price:2500, description:"Kids bowling set with colorful pins and a fun plastic ball — great for hand-eye coordination.", age_plus:4, isEducational:true, category:"plastic toys", rating:3.6, stock:68, img:["https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774270779/uploads/user/1774270779129-kids-bowling.jpg.png"] },
  { _id:"4", name:"Build & Race Car", price:3500, description:"Toy car with building blocks that can be assembled and customized — endless building possibilities.", age_plus:5, isEducational:true, category:"plastic toys", rating:4, stock:89, img:["https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774271115/uploads/user/1774271114791-lego-car.jpg.png"] },
  { _id:"5", name:"Little Chef's Kitchen Set", price:3000, description:"Toy kitchen set with utensils, pots, pans, pretend food items — hours of imaginative cooking play.", age_plus:5, isEducational:true, category:"plastic toys", rating:4, stock:57, img:["https://res.cloudinary.com/dbtkfjrvd/image/upload/v1774271824/uploads/user/1774271824751-play-kitchen.jpg.png"] }
];

function MiniCard({ product, onAdd }) {
  const navigate = useNavigate();
  const mainImg = Array.isArray(product.img) ? product.img[0] : product.img;
  const stars = Array.from({length:5},(_,i)=>i<Math.round(product.rating||0)?'★':'☆').join('');
  return (
    <div className="mini-card" onClick={()=>{navigate('/product/'+product._id);window.scrollTo({top:0,behavior:'smooth'});}}>
      <div className="mini-card-img">
        {product.isEducational && <span className="mini-edu">Educational</span>}
        <img src={mainImg} alt={product.name} onError={e=>{e.target.src='https://placehold.co/200x200/e8f4fd/1a7fe8?text=toy';}}/>
        <div className="mini-hover"><button onClick={e=>{e.stopPropagation();onAdd(product);}}>🛒 Add</button></div>
      </div>
      <div className="mini-card-body">
        <span className="mini-cat">{product.category}</span>
        <h4>{product.name}</h4>
        <div className="mini-stars">{stars}</div>
        <div className="mini-footer">
          <strong>{product.price?.toLocaleString()} DA</strong>
          {product.age_plus && <span>{product.age_plus}+</span>}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, products, loading, error } = useSelector(s => s.products);
  const { isAuthenticated } = useSelector(s => s.auth);

  // activeIdx tracks which thumbnail is shown in the main viewer
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);                    // reset to first image when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Fetch single product if user is authenticated
    if (isAuthenticated) {
        dispatch(fetchProductById(id));
    }

    // Only fetch all products if the list is empty
    if (products.length === 0) {
        dispatch(fetchAllProducts());
    }

    return () => {
        dispatch(clearCurrentProduct());
    };
}, [dispatch, id, isAuthenticated, products.length]);

  const handleAdd = (product) => dispatch(addToCart(product));

  const allProducts = products.length > 0 ? products : DEMO;
  const p = currentProduct || allProducts.find(item => item._id === id);

  // Normalize img to always be an array
  const images = p ? (Array.isArray(p.img) ? p.img : (p.img ? [p.img] : [])) : [];

  const related = allProducts
    .filter(item => item._id !== id)
    .sort((a,b) => (p && a.category===p.category ? -1 : 0) - (p && b.category===p.category ? -1 : 0))
    .slice(0, 4);

  if (loading && !p) return <div className="page-wrapper"><div className="spinner-wrap"><div className="spinner"/></div></div>;

  if (!p) return (
    <div className="page-wrapper">
      <div className="container" style={{textAlign:'center',padding:'80px 20px'}}>
        <div style={{fontSize:64}}>😢</div>
        <h2 style={{fontFamily:'var(--font-head)',marginTop:16}}>Product not found</h2>
        <p style={{color:'var(--text-muted)',margin:'12px 0 24px'}}>{error||'This toy escaped!'}</p>
        <Link to="/" className="btn btn-primary">← Back to Shop</Link>
      </div>
    </div>
  );

  const stars = Array.from({length:5},(_,i)=>i<Math.round(p.rating||0)?'★':'☆').join('');
  const inStock = (p.stock||0) > 0;

  return (
    <div className="page-wrapper">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span> › </span>
          <span style={{textTransform:'capitalize'}}>{p.category}</span><span> › </span>
          <span className="bc-current">{p.name}</span>
        </nav>

        <div className="detail-grid">
          {/* ── Image Column ── */}
          <div className="detail-img-col">
            {/* Main image viewer */}
            <div className="detail-img-wrap">
              {p.isEducational && <span className="detail-edu">📚 Educational Toy</span>}
              <img
                src={images[activeIdx] || 'https://placehold.co/500x500/e8f4fd/1a7fe8?text=toy'}
                alt={p.name}
                onError={e=>{e.target.src='https://placehold.co/500x500/e8f4fd/1a7fe8?text=toy';}}
              />
              {images.length > 1 && (
                <>
                  <button className="img-nav img-prev" onClick={()=>setActiveIdx(i=>(i-1+images.length)%images.length)}>‹</button>
                  <button className="img-nav img-next" onClick={()=>setActiveIdx(i=>(i+1)%images.length)}>›</button>
                  <div className="img-counter">{activeIdx+1} / {images.length}</div>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((src, i) => (
                  <div key={i}
                    className={'thumb'+(i===activeIdx?' active':'')}
                    onClick={()=>setActiveIdx(i)}>
                    <img src={src} alt={`view ${i+1}`}
                      onError={e=>{e.target.src='https://placehold.co/80x80/e8f4fd/1a7fe8?text=img';}}/>
                  </div>
                ))}
              </div>
            )}

            <div className={'stock-bar '+(inStock?'in-stock':'out-stock')}>
              <span className="sdot"/>
              {inStock ? '✅ In Stock — '+p.stock+' units available' : '❌ Out of Stock'}
            </div>
          </div>

          {/* ── Info Column ── */}
          <div className="detail-info">
            <div className="detail-meta">
              <span className="detail-cat">{p.category}</span>
              {p.sku && <span className="detail-sku">SKU: {p.sku}</span>}
            </div>
            <h1 className="detail-title">{p.name}</h1>
            <div className="detail-rating">
              <span className="detail-stars">{stars}</span>
              <span className="detail-rating-num">{(p.rating||0).toFixed(1)} / 5</span>
              {p.nbr_commande>0 && <span className="detail-orders">{p.nbr_commande} orders</span>}
            </div>
            <div className="detail-price-wrap">
              <span className="detail-price">{p.price?.toLocaleString()}</span>
              <span className="detail-currency">DA</span>
            </div>
            {p.age_plus && (
              <div className="detail-age">
                <span>👶</span>
                <div><strong>Recommended Age</strong><p>{p.age_plus}+ years old</p></div>
              </div>
            )}
            <div className="detail-desc"><h3>About this toy</h3><p>{p.description}</p></div>
            {p.sizes && p.sizes.length>0 && (
              <div className="detail-sizes">
                <h4>Available Sizes</h4>
                <div className="size-pills">{p.sizes.map(s=><span key={s} className="size-pill">{s}</span>)}</div>
              </div>
            )}
            {p.tags && p.tags.length>0 && (
              <div className="detail-tags">{p.tags.map(t=><span key={t} className="tag-pill">#{t}</span>)}</div>
            )}
            <div className="detail-actions">
              <button className="btn btn-primary btn-add" onClick={()=>handleAdd(p)} disabled={!inStock}>🛒 Add to Basket</button>
              <Link to="/" className="btn btn-outline">← Keep Shopping</Link>
            </div>
            <div className="trust-badges">
              <div className="trust-item"><span>🛡️</span><div><strong>CE Certified</strong><p>Safety guaranteed</p></div></div>
              <div className="trust-item"><span>🚚</span><div><strong>Fast Delivery</strong><p>3–7 business days</p></div></div>
              <div className="trust-item"><span>🔄</span><div><strong>Easy Returns</strong><p>14-day policy</p></div></div>
            </div>
          </div>
        </div>

        {related.length>0 && (
          <section className="recommendations">
            <div className="rec-header">
              <h2>🧸 You Might Also Like</h2>
              <p>More fun toys for curious minds</p>
            </div>
            <div className="rec-grid">
              {related.map(item=><MiniCard key={item._id} product={item} onAdd={handleAdd}/>)}
            </div>
            <div className="rec-footer"><Link to="/" className="btn btn-outline">View All Toys →</Link></div>
          </section>
        )}
      </div>
    </div>
  );
}
