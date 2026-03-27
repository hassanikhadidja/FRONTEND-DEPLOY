// ── OrdersTab.js — drop this inside Dashboard.js as a sub-component
// or use directly in the activeTab === 'orders' section

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../redux/orderSlice';

const STATUS_COLORS = {
  pending:   { bg: '#fff3cd', color: '#856404', label: '⏳ Pending' },
  confirmed: { bg: '#cce5ff', color: '#004085', label: '✅ Confirmed' },
  shipped:   { bg: '#d4edda', color: '#155724', label: '🚚 Shipped' },
  delivered: { bg: '#d1e7dd', color: '#0a3622', label: '📦 Delivered' },
  cancelled: { bg: '#f8d7da', color: '#721c24', label: '❌ Cancelled' },
};

export default function OrdersTab() {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(s => s.orders);

  useEffect(() => { dispatch(fetchAllOrders()); }, [dispatch]);

  const handleStatus = (id, status) => dispatch(updateOrderStatus({ id, status }));

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.total, 0);

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Mini stats */}
      <div className="orders-stats">
        <div className="ostat"><strong>{orders.length}</strong><span>Total Orders</span></div>
        <div className="ostat"><strong>{statusCounts.pending || 0}</strong><span>⏳ Pending</span></div>
        <div className="ostat"><strong>{statusCounts.confirmed || 0}</strong><span>✅ Confirmed</span></div>
        <div className="ostat"><strong>{statusCounts.shipped || 0}</strong><span>🚚 Shipped</span></div>
        <div className="ostat revenue"><strong>{totalRevenue.toLocaleString()} DA</strong><span>Revenue</span></div>
      </div>

      <div className="dash-table-card" style={{ marginTop: 0 }}>
        <div className="users-tab-head">
          <h2>📋 Orders ({orders.length})</h2>
          <button className="btn btn-outline btn-sm" onClick={() => dispatch(fetchAllOrders())}>↺ Refresh</button>
        </div>

        {loading && <div className="spinner-wrap"><div className="spinner" /></div>}
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {!loading && !error && (
          orders.length === 0 ? (
            <div className="dash-placeholder" style={{ border: 'none', boxShadow: 'none' }}>
              <div style={{ fontSize: 52 }}>📋</div>
              <h3>No orders yet</h3>
              <p>Orders placed by customers will appear here.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="dash-table orders-table">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Delivery</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
                    return (
                      <tr key={order._id}>
                        <td><code className="order-ref">{order.orderNumber}</code></td>
                        <td className="td-customer">
                          <div className="cust-avatar">{order.customer?.name?.[0]?.toUpperCase() || '?'}</div>
                          <div>
                            <strong>{order.customer?.name}</strong>
                            <small>{order.customer?.phone}</small>
                            <small>{order.customer?.commune}, {order.customer?.wilaya}</small>
                          </div>
                        </td>
                        <td>
                          <div className="order-items-preview">
                            {order.items?.slice(0, 2).map((item, i) => (
                              <div key={i} className="oip-item">
                                {item.img && (
                                  <img src={Array.isArray(item.img) ? item.img[0] : item.img}
                                    alt={item.name}
                                    onError={e => { e.target.style.display = 'none'; }} />
                                )}
                                <span>{item.quantity}× {item.name}</span>
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <small>+{order.items.length - 2} more</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="order-price-col">
                            <strong className="t-price">{order.total?.toLocaleString()} DA</strong>
                            {order.deliveryFee === 0
                              ? <span className="delivery-free-chip">Free delivery</span>
                              : <span className="delivery-fee-chip">+{order.deliveryFee} DA delivery</span>}
                          </div>
                        </td>
                        <td>💵 Cash</td>
                        <td className="td-date">
                          {new Date(order.createdAt).toLocaleDateString('fr-DZ', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td>
                          <span className="status-badge" style={{ background: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={e => handleStatus(order._id, e.target.value)}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="confirmed">✅ Confirmed</option>
                            <option value="shipped">🚚 Shipped</option>
                            <option value="delivered">📦 Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  );
}
