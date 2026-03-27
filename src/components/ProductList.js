import React, { useState } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList({ products }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  let filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
           (category === 'all' || p.category === category);
  });
  if (sortBy === 'price-asc')  filtered = [...filtered].sort((a,b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered = [...filtered].sort((a,b) => b.price - a.price);
  if (sortBy === 'rating')     filtered = [...filtered].sort((a,b) => b.rating - a.rating);
  return (
    <section className="pl-section">
      <div className="pl-filters">
        <div className="pl-search">
          <span>🔍</span>
          <input type="text" placeholder="Search toys..." value={search} onChange={e=>setSearch(e.target.value)} />
          {search && <button onClick={()=>setSearch('')}>✕</button>}
        </div>
        <div className="pl-pills">
          {categories.map(cat => (
            <button key={cat} className={'pl-pill' + (category===cat?' active':'')} onClick={()=>setCategory(cat)}>
              {cat === 'all' ? 'All Toys' : cat}
            </button>
          ))}
        </div>
        <select className="pl-sort" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="default">Sort by</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>
      <p className="pl-count">Showing <strong>{filtered.length}</strong> toy{filtered.length!==1?'s':''}</p>
      {filtered.length > 0 ? (
        <div className="pl-grid">
          {filtered.map((p,i) => <div key={p._id} style={{animationDelay:i*.06+'s'}}><ProductCard product={p} /></div>)}
        </div>
      ) : (
        <div className="pl-empty">
          <div style={{fontSize:56}}>🔍</div>
          <h3>No toys found</h3>
          <p>Try a different search or category</p>
          <button className="btn btn-primary" onClick={()=>{setSearch('');setCategory('all');}}>Show All</button>
        </div>
      )}
    </section>
  );
}
