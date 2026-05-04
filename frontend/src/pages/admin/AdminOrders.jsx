import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrders(res.data.data.orders);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [API_URL]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Customer Orders</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Delivery</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center">Loading...</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td>
                    <a href={`/admin/invoice/${o._id}`} className="fw-bold">#{o.invoice_number}</a>
                    <br/><small className="text-muted">{new Date(o.createdAt).toLocaleDateString()}</small>
                  </td>
                  <td>{o.first_name} {o.last_name}<br/><small className="text-muted">{o.phone_number}</small></td>
                  <td>{o.product} x {o.quantity}</td>
                  <td>₹ {o.total_booking_amount}</td>
                  <td>
                    <span className={`badge bg-${o.payment_status === 'successful' ? 'success' : 'warning'}`}>
                      {o.payment_status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-select form-select-sm"
                      style={{ width: '130px' }}
                      value={o.delivery_status || 'Pending'}
                      onChange={async (e) => {
                        try {
                          await axios.patch(`${API_URL}/api/admin/orders/${o._id}/status`, { status: e.target.value }, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                          });
                          setOrders(orders.map(order => order._id === o._id ? { ...order, delivery_status: e.target.value } : order));
                        } catch (err) {
                          alert('Failed to update status');
                        }
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <a href={`/dash/invoice/${o._id}`} className="btn btn-sm btn-outline-dark me-1" title="View Invoice">
                      <i className="bi bi-file-earmark-text"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
