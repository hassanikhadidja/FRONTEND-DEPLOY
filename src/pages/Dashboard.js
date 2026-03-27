import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, deleteProduct } from '../redux/productSlice';
import { fetchAllOrders, updateOrderStatus, deleteOrder } from '../redux/orderSlice';
import { createProduct as apiCreate, updateProduct as apiUpdate } from '../services/productApi';
import { getAllUsers } from '../services/userApi';
import './Dashboard.css';

const EMPTY = {
  name:'', price:'', description:'',
  existingImgs: [],   // URLs already stored in DB
  newFiles:     [],   // new File objects picked by user
  removedImgs:  new Set(), // Set of existing URLs marked for deletion
  category:'plastic toys', age_plus:'', isEducational:false,
  stock:'', sku:'', sizes:'', tags:'', rating:'', nbr_commande:''
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { products, loading: prodLoading } = useSelector(s => s.products);
  const { orders, loading: ordersLoading, error: ordersError } = useSelector(s => s.orders);
  const { user } = useSelector(s => s.auth);

  const [activeTab, setActiveTab]       = useState('products');
  const [form, setForm]                 = useState(EMPTY);
  const [editId, setEditId]             = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [saving, setSaving]             = useState(false);
  const [msg, setMsg]                   = useState('');
  const [msgType, setMsgType]           = useState('success');
  const [delId, setDelId]               = useState(null);
  const [delOrderId, setDelOrderId]     = useState(null);
  const [users, setUsers]               = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError]     = useState('');

  useEffect(() => { dispatch(fetchAllProducts()); }, [dispatch]);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true); setUsersError('');
    try { const d = await getAllUsers(); setUsers(Array.isArray(d) ? d : []); }
    catch (e) { setUsersError(e.response?.data?.msg || 'Failed to load users'); }
    finally { setUsersLoading(false); }
  }, []);

  useEffect(() => { if (activeTab === 'users') loadUsers(); }, [activeTab, loadUsers]);

  const flash = (m, type = 'success') => {
    setMsg(m); setMsgType(type); setTimeout(() => setMsg(''), 4000);
  };

  // ── Image manager helpers ───────────────────────────────────────

  // Pick new files from the file input — APPEND to existing selection
  const handleAddFiles = (e) => {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;
    setForm(f => ({ ...f, newFiles: [...f.newFiles, ...picked] }));
    e.target.value = ''; // reset so same file can be picked again
  };

  // Remove a newly selected file (not yet uploaded)
  const removeNewFile = (idx) => {
    setForm(f => ({ ...f, newFiles: f.newFiles.filter((_, i) => i !== idx) }));
  };

  // Toggle deletion of an existing DB image (click once = mark red, click again = restore)
  const toggleRemoveExisting = (url) => {
    setForm(f => {
      const next = new Set(f.removedImgs);
      if (next.has(url)) next.delete(url); else next.add(url);
      return { ...f, removedImgs: next };
    });
  };

  // Restore all marked-for-deletion images
  const restoreAll = () => setForm(f => ({ ...f, removedImgs: new Set() }));

  // ── Submit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Count final images
    const keptUrls = form.existingImgs.filter(u => !form.removedImgs.has(u));
    if (!editId && form.newFiles.length === 0) {
      flash('❌ Please select at least one image', 'error');
      setSaving(false); return;
    }
    if (editId && keptUrls.length === 0 && form.newFiles.length === 0) {
      flash('❌ Product must keep at least one image', 'error');
      setSaving(false); return;
    }

    const fd = new FormData();
    fd.append('name',          form.name);
    fd.append('price',         String(Number(form.price)));
    fd.append('description',   form.description);
    fd.append('category',      form.category);
    fd.append('age_plus',      String(Number(form.age_plus)));
    fd.append('isEducational', String(form.isEducational));
    fd.append('stock',         String(Number(form.stock)));
    if (form.sku)   fd.append('sku', form.sku);
    if (form.sizes) form.sizes.split(',').map(s=>s.trim()).filter(Boolean).forEach(s=>fd.append('sizes',s));
    if (form.tags)  form.tags.split(',').map(t=>t.trim()).filter(Boolean).forEach(t=>fd.append('tags',t));
    if (form.rating !== '')       fd.append('rating',       String(Number(form.rating)));
    if (form.nbr_commande !== '') fd.append('nbr_commande', String(Number(form.nbr_commande)));

    // Existing URLs to keep → backend will merge with newly uploaded ones
    keptUrls.forEach(url => fd.append('keepImgs', url));

    // New files to upload
    form.newFiles.forEach(file => fd.append('files', file, file.name));

    try {
      if (editId) { await apiUpdate(editId, fd); flash('✅ Product updated!'); }
      else        { await apiCreate(fd);          flash('🎉 Product added!'); }
      dispatch(fetchAllProducts());
      setForm(EMPTY); setEditId(null); setShowForm(false);
    } catch (err) {
      const s = err.response?.data?.msg || err.message || 'Error';
      flash('❌ ' + s, 'error');
    } finally { setSaving(false); }
  };

  const handleEdit = (p) => {
    const imgs = Array.isArray(p.img) ? p.img : (p.img ? [p.img] : []);
    setForm({
      name:p.name, price:p.price, description:p.description,
      existingImgs: imgs, newFiles: [], removedImgs: new Set(),
      category:p.category, age_plus:p.age_plus||'',
      isEducational:p.isEducational, stock:p.stock,
      sku:p.sku||'', sizes:(p.sizes||[]).join(', '),
      tags:(p.tags||[]).join(', '), rating:p.rating||'', nbr_commande:p.nbr_commande||''
    });
    setEditId(p._id); setShowForm(true);
    setActiveTab('products');
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  const handleDelete = async (id) => {
    try { await dispatch(deleteProduct(id)).unwrap(); setDelId(null); flash('🗑️ Deleted.'); }
    catch { setDelId(null); flash('❌ Delete failed','error'); }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
    } catch (e) {
      flash(typeof e === 'string' ? `❌ ${e}` : '❌ Could not update status', 'error');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      await dispatch(deleteOrder(id)).unwrap();
      setDelOrderId(null);
      flash('🗑️ Order removed');
    } catch (e) {
      setDelOrderId(null);
      flash(typeof e === 'string' ? `❌ ${e}` : '❌ Could not delete order', 'error');
    }
  };

  const totalStock  = products.reduce((s,p) => s+(p.stock||0), 0);
  const totalOrders = products.reduce((s,p) => s+(p.nbr_commande||0), 0);
  const firstImg    = (p) => Array.isArray(p.img) ? p.img[0] : p.img;

  // Summary counts
  const keptCount    = form.existingImgs.filter(u => !form.removedImgs.has(u)).length;
  const totalImgCount = keptCount + form.newFiles.length;

  return (
    <div className="page-wrapper">
      <div className="container dash-wrap">

        <div className="dash-head">
          <div>
            <h1 className="dash-title">🛠️ Admin Dashboard</h1>
            <p className="dash-sub">Logged in as <strong>{user?.name||user?.email}</strong><span className="admin-role-badge">Admin</span></p>
          </div>
          {activeTab==='products' && (
            <button className="btn btn-primary" onClick={()=>{setShowForm(s=>!s);setEditId(null);setForm(EMPTY);}}>
              {showForm ? '✕ Cancel' : '+ Add New Toy'}
            </button>
          )}
        </div>

        <div className="dash-stats">
          <div className="dash-stat"><div className="ds-icon">🧸</div><div><strong>{products.length}</strong><span>Products</span></div></div>
          <div className="dash-stat"><div className="ds-icon">📦</div><div><strong>{totalStock.toLocaleString()}</strong><span>In Stock</span></div></div>
          <div className="dash-stat"><div className="ds-icon">🛒</div><div><strong>{totalOrders.toLocaleString()}</strong><span>Orders</span></div></div>
          <div className="dash-stat"><div className="ds-icon">👥</div><div><strong>{users.length||'—'}</strong><span>Users</span></div></div>
          <div className="dash-stat" style={{borderLeftColor:'var(--yellow)'}}><div className="ds-icon">📋</div><div><strong>{orders.length}</strong><span>Orders</span></div></div>
        </div>

        <div className="dash-tabs">
          <button className={'dash-tab'+(activeTab==='products'?' active':'')} onClick={()=>setActiveTab('products')}>🧸 Products</button>
          <button className={'dash-tab'+(activeTab==='users'?' active':'')} onClick={()=>setActiveTab('users')}>👥 Users</button>
          <button className={'dash-tab'+(activeTab==='orders'?' active':'')} onClick={()=>{setActiveTab('orders');dispatch(fetchAllOrders());}}>📋 Orders {orders.length>0&&<span className='tab-count'>{orders.filter(o=>o.status==='pending').length>0?orders.filter(o=>o.status==='pending').length:''}</span>}</button>
        </div>

        {msg && <div className={'alert alert-'+(msgType==='error'?'error':'success')}>{msg}</div>}

        {/* ══════════════ PRODUCTS TAB ══════════════ */}
        {activeTab === 'products' && (
          <>
            {showForm && (
              <div className="dash-form-card">
                <h2>{editId ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="dash-form">

                  <div className="df-row">
                    <div className="form-group"><label>Name *</label>
                      <input type="text" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="Build & Race Car"/>
                    </div>
                    <div className="form-group"><label>SKU</label>
                      <input type="text" value={form.sku} onChange={e=>setForm(f=>({...f,sku:e.target.value}))} placeholder="ENT-CAR-001"/>
                    </div>
                  </div>

                  <div className="df-row">
                    <div className="form-group"><label>Price (DA) *</label>
                      <input type="number" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} required min="0" placeholder="2500"/>
                    </div>
                    <div className="form-group"><label>Stock</label>
                      <input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} min="0" placeholder="100"/>
                    </div>
                    <div className="form-group"><label>Age +</label>
                      <input type="number" value={form.age_plus} onChange={e=>setForm(f=>({...f,age_plus:e.target.value}))} min="0" placeholder="3"/>
                    </div>
                  </div>

                  <div className="df-row">
                    <div className="form-group"><label>Category *</label>
                      <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                        <option value="plastic toys">Plastic Toys</option>
                        <option value="outdoor play">Outdoor Play</option>
                        <option value="building sets">Building Sets</option>
                        <option value="vehicles">Vehicles</option>
                        <option value="dolls & accessories">Dolls & Accessories</option>
                        <option value="educational toys">Educational Toys</option>
                        <option value="pretend play">Pretend Play</option>
                        <option value="puzzles & games">Puzzles & Games</option>
                        <option value="baby & toddler">Baby & Toddler</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="form-group"><label>Sizes <span className="field-hint">(comma-separated)</span></label>
                      <input type="text" value={form.sizes} onChange={e=>setForm(f=>({...f,sizes:e.target.value}))} placeholder="small, medium, large"/>
                    </div>
                  </div>

                  {/* ══════════════ IMAGE MANAGER ══════════════ */}
                  <div className="form-group">
                    <label>Product Images {!editId && '*'}</label>

                    <div className="img-manager">

                      {/* SECTION A — Existing images (edit mode only) */}
                      {editId && form.existingImgs.length > 0 && (
                        <div className="img-section">
                          <div className="img-section-header">
                            <span className="img-section-title">📁 Current images ({form.existingImgs.length})</span>
                            <span className="img-section-hint">Click ✕ to mark for deletion · Click ↩ to restore</span>
                          </div>
                          <div className="img-grid">
                            {form.existingImgs.map((url, i) => {
                              const isRemoved = form.removedImgs.has(url);
                              return (
                                <div key={url} className={'img-thumb' + (isRemoved ? ' img-removed' : '')}>
                                  <img src={url} alt={`img ${i+1}`}
                                    onError={e=>{e.target.src='https://placehold.co/90x90/e8f4fd/1a7fe8?text=img';}}/>
                                  {i === 0 && !isRemoved && <span className="img-badge img-badge-main">Main</span>}
                                  {isRemoved && <div className="img-removed-overlay">🗑️ Deleted on save</div>}
                                  <button
                                    type="button"
                                    className={'img-action-btn' + (isRemoved ? ' restore' : ' remove')}
                                    onClick={() => toggleRemoveExisting(url)}
                                    title={isRemoved ? 'Restore' : 'Remove'}
                                  >{isRemoved ? '↩' : '✕'}</button>
                                </div>
                              );
                            })}
                          </div>
                          {form.removedImgs.size > 0 && (
                            <div className="img-removal-bar">
                              <span>⚠️ {form.removedImgs.size} image{form.removedImgs.size > 1 ? 's' : ''} will be deleted on save</span>
                              <button type="button" className="img-restore-all-btn" onClick={restoreAll}>↩ Restore all</button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SECTION B — Newly selected files */}
                      {form.newFiles.length > 0 && (
                        <div className="img-section">
                          <div className="img-section-header">
                            <span className="img-section-title">🆕 New images to add ({form.newFiles.length})</span>
                            <span className="img-section-hint">These will be uploaded and added to the product</span>
                          </div>
                          <div className="img-grid">
                            {form.newFiles.map((file, i) => (
                              <div key={i} className="img-thumb img-thumb-new">
                                <img src={URL.createObjectURL(file)} alt={file.name}/>
                                <span className="img-badge img-badge-new">New</span>
                                <button type="button" className="img-action-btn remove" onClick={() => removeNewFile(i)} title="Remove">✕</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ADD button */}
                      <label className="img-add-btn" htmlFor="img-file-input">
                        <span>📷</span>
                        <span>{totalImgCount > 0 ? '+ Add more images' : 'Select images (one or more)'}</span>
                      </label>
                      <input id="img-file-input" type="file" accept="image/*" multiple onChange={handleAddFiles} style={{display:'none'}}/>

                      {/* Live summary bar */}
                      <div className="img-summary-bar">
                        {totalImgCount === 0
                          ? <span className="img-sum-empty">No images selected yet</span>
                          : <>
                              {keptCount > 0 && <span className="img-sum-pill kept">✅ {keptCount} kept</span>}
                              {form.newFiles.length > 0 && <span className="img-sum-pill new-pill">🆕 {form.newFiles.length} new</span>}
                              {form.removedImgs.size > 0 && <span className="img-sum-pill del-pill">🗑️ {form.removedImgs.size} deleted</span>}
                              <span className="img-sum-pill total-pill">📸 {totalImgCount} total</span>
                            </>
                        }
                      </div>
                    </div>
                  </div>
                  {/* ══════════════ END IMAGE MANAGER ══════════════ */}

                  <div className="form-group"><label>Description *</label>
                    <textarea rows="3" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} required placeholder="Describe this toy..."/>
                  </div>

                  <div className="df-row">
                    <div className="form-group">
                      <label>Tags <span className="field-hint">(comma-separated)</span></label>
                      <input type="text" value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} placeholder="lego-car, plastic, kids"/>
                      <small className="field-tip">Help with search and filtering</small>
                    </div>
                    <div className="form-group">
                      <label>Rating <span className="field-hint">(0 – 5)</span></label>
                      <div className="rating-input-wrap">
                        <input type="number" value={form.rating} onChange={e=>setForm(f=>({...f,rating:e.target.value}))} min="0" max="5" step="0.1" placeholder="4.5"/>
                        <div className="rating-stars-preview">
                          {form.rating !== '' && Array.from({length:5},(_,i)=>(
                            <span key={i} style={{color:i<Math.round(Number(form.rating))?'var(--yellow)':'#ddd',fontSize:18}}>★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Orders <span className="field-hint">(nbr_commande)</span></label>
                      <input type="number" value={form.nbr_commande} onChange={e=>setForm(f=>({...f,nbr_commande:e.target.value}))} min="0" placeholder="0"/>
                      <small className="field-tip">Number of times ordered</small>
                    </div>
                  </div>

                  <label className="df-check">
                    <input type="checkbox" checked={form.isEducational} onChange={e=>setForm(f=>({...f,isEducational:e.target.checked}))}/>
                    📚 Educational toy
                  </label>

                  <div className="df-actions">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? 'Saving...' : (editId ? '💾 Save Changes' : '🚀 Add Product')}
                    </button>
                    <button type="button" className="btn btn-outline" onClick={()=>{setShowForm(false);setEditId(null);setForm(EMPTY);}}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="dash-table-card">
              <h2>🧸 Products ({products.length})</h2>
              {prodLoading ? <div className="spinner-wrap"><div className="spinner"/></div> : (
                <div className="table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Product</th><th>Images</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td className="td-prod">
                            <img src={firstImg(p)} alt={p.name} onError={e=>{e.target.src='https://placehold.co/48x48/e8f4fd/1a7fe8?text=T';}}/>
                            <div><strong>{p.name}</strong><small>{p.sku}</small></div>
                          </td>
                          <td><span className="img-count-badge">🖼️ {Array.isArray(p.img)?p.img.length:(p.img?1:0)}</span></td>
                          <td><span className="t-badge">{p.category}</span></td>
                          <td><strong className="t-price">{p.price?.toLocaleString()} DA</strong></td>
                          <td><span className={'stock-chip'+((p.stock||0)<20?' low':' ok')}>{p.stock}</span></td>
                          <td>⭐ {p.rating||'—'}</td>
                          <td className="td-actions">
                            <button className="act-btn edit" onClick={()=>handleEdit(p)}>✏️ Edit</button>
                            <button className="act-btn del" onClick={()=>setDelId(p._id)}>🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════ USERS TAB ══════════════ */}
        {activeTab === 'users' && (
          <div className="dash-table-card">
            <div className="users-tab-head">
              <h2>👥 Registered Users ({users.length})</h2>
              <button className="btn btn-outline btn-sm" onClick={loadUsers}>↺ Refresh</button>
            </div>
            {usersLoading && <div className="spinner-wrap"><div className="spinner"/></div>}
            {usersError && <div className="alert alert-error">⚠️ {usersError}</div>}
            {!usersLoading && !usersError && (users.length === 0
              ? <div className="dash-placeholder" style={{border:'none',boxShadow:'none'}}><div style={{fontSize:48}}>👤</div><h3>No clients yet</h3></div>
              : <div className="table-wrap">
                  <table className="dash-table">
                    <thead><tr><th>Client</th><th>Email</th><th>Role</th><th>Registered</th><th>Activity</th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td className="td-user"><div className="user-avatar">{(u.name||u.email||'?')[0].toUpperCase()}</div><strong>{u.name||'—'}</strong></td>
                          <td className="td-email">{u.email}</td>
                          <td><span className={'role-badge role-'+(u.role||'user')}>{u.role==='admin'?'🛠️ Admin':'👤 Client'}</span></td>
                          <td className="td-date">{u.createdAt?new Date(u.createdAt).toLocaleDateString('fr-DZ',{day:'2-digit',month:'short',year:'numeric'}):'—'}</td>
                          <td><div className="activity-pills">{u.nbr_commande>0?<span className="activity-pill orders">🛒 {u.nbr_commande} orders</span>:<span className="activity-pill none">No orders</span>}</div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            )}
          </div>
        )}

        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div>
            <div className="orders-stats">
              {[
                { val: orders.length, label: 'Total Orders', icon: '📋' },
                { val: orders.filter(o => o.status === 'pending').length, label: '⏳ Pending', icon: '' },
                { val: orders.filter(o => o.status === 'confirmed').length, label: '✅ Confirmed', icon: '' },
                { val: orders.filter(o => o.status === 'shipped').length, label: '🚚 Shipped', icon: '' },
                { 
                  val: orders.filter(o => o.status !== 'cancelled')
                            .reduce((s, o) => s + (o.total || 0), 0)
                            .toLocaleString() + ' DA', 
                  label: '💰 Revenue', 
                  icon: '' 
                },
              ].map((s, i) => (
                <div key={i} className={'ostat' + (i === 4 ? ' ostat-revenue' : '')}>
                  <strong>{s.val}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="dash-table-card">
              <div className="users-tab-head">
                <h2>📋 Orders ({orders.length})</h2>
                <button 
                  className="btn btn-outline btn-sm" 
                  onClick={() => dispatch(fetchAllOrders())}
                >
                  ↺ Refresh
                </button>
              </div>

              {ordersLoading && <div className="spinner-wrap"><div className="spinner" /></div>}
              {ordersError && <div className="alert alert-error">⚠️ {ordersError}</div>}

              {!ordersLoading && !ordersError && orders.length === 0 ? (
                <div className="dash-placeholder" style={{border: 'none', boxShadow: 'none'}}>
                  <div style={{fontSize: 52}}>📋</div>
                  <h3>No orders yet</h3>
                  <p>Customer orders will appear here.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Update</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => {
                        const SC = {
                          pending:    { bg: '#fff3cd', color: '#856404', label: '⏳ Pending' },
                          confirmed:  { bg: '#cce5ff', color: '#004085', label: '✅ Confirmed' },
                          shipped:    { bg: '#d4edda', color: '#155724', label: '🚚 Shipped' },
                          delivered:  { bg: '#d1e7dd', color: '#0a3622', label: '📦 Delivered' },
                          cancelled:  { bg: '#f8d7da', color: '#721c24', label: '❌ Cancelled' },
                        };
                        const sc = SC[order.status] || SC.pending;

                        return (
                          <tr key={order._id}>
                            <td><code className="order-ref">
                              {order.orderNumber || order._id?.slice(0,8)?.toUpperCase() || '—'}
                            </code></td>

                            <td className="td-customer">
                              <div className="cust-avatar">
                                {(order.customerName || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <strong>{order.customerName || '—'}</strong>
                                <small>{order.phone || '—'}</small>
                                <small>{order.commune}, {order.wilaya}</small>
                              </div>
                            </td>

                            <td>
                              <div className="order-items-preview">
                                {(order.items || []).slice(0, 2).map((item, i) => (
                                  <div key={i} className="oip-row">
                                    {item.img && (
                                      <img 
                                        src={Array.isArray(item.img) ? item.img[0] : item.img} 
                                        alt={item.name} 
                                        style={{width:28, height:28, borderRadius:6, objectFit:'cover'}} 
                                        onError={e => { e.target.style.display = 'none'; }}
                                      />
                                    )}
                                    <span>{item.quantity}× {item.name}</span>
                                  </div>
                                ))}
                                {(order.items || []).length > 2 && (
                                  <small style={{color: 'var(--text-muted)'}}>
                                    +{(order.items || []).length - 2} more
                                  </small>
                                )}
                              </div>
                            </td>

                            <td>
                              <div style={{display:'flex', flexDirection:'column', gap:3}}>
                                <strong className="t-price">
                                  {order.total?.toLocaleString()} DA
                                </strong>
                                {order.deliveryFee === 0 ? (
                                  <span style={{fontSize:11, color:'#27ae60', fontWeight:800}}>🆓 Free delivery</span>
                                ) : (
                                  <span style={{fontSize:11, color:'var(--text-muted)', fontWeight:600}}>
                                    +{order.deliveryFee} DA delivery
                                  </span>
                                )}
                              </div>
                            </td>

                            <td style={{fontSize:13, fontWeight:700}}>💵 Cash</td>

                            <td className="td-date">
                              {new Date(order.createdAt).toLocaleDateString('fr-DZ', {
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric'
                              })}
                            </td>

                            <td>
                              <span 
                                className="status-badge" 
                                style={{background: sc.bg, color: sc.color}}
                              >
                                {sc.label}
                              </span>
                            </td>

                            <td>
                              <select 
                                className="status-select" 
                                value={['pending','confirmed','shipped','delivered','cancelled'].includes(order.status) ? order.status : 'pending'}
                                onChange={e => handleOrderStatusChange(order._id, e.target.value)}
                              >
                                <option value="pending">⏳ Pending</option>
                                <option value="confirmed">✅ Confirmed</option>
                                <option value="shipped">🚚 Shipped</option>
                                <option value="delivered">📦 Delivered</option>
                                <option value="cancelled">❌ Cancelled</option>
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="act-btn del"
                                title="Delete order"
                                onClick={() => setDelOrderId(order._id)}
                              >
                                🗑️
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {delId && (
        <div className="modal-overlay" role="presentation" onClick={() => setDelId(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Delete this product?</h3>
            <p>This cannot be undone.</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setDelId(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" style={{ background: '#c0392b', borderColor: '#c0392b' }} onClick={() => handleDelete(delId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {delOrderId && (
        <div className="modal-overlay" role="presentation" onClick={() => setDelOrderId(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Delete this order?</h3>
            <p>It will be removed from the admin list. Use only if the backend supports deletion.</p>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setDelOrderId(null)}>Cancel</button>
              <button type="button" className="btn btn-primary" style={{ background: '#c0392b', borderColor: '#c0392b' }} onClick={() => handleDeleteOrder(delOrderId)}>Delete order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}