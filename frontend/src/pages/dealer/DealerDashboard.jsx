import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DealerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dealer/orders`, {
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
        <h5 className="mb-0">My Dealership Orders</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Order #</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="5" className="text-center">No orders found.</td></tr>
              ) : orders.map(o => (
                <tr key={o._id}>
                  <td><strong>#{o.invoice_number}</strong></td>
                  <td>{o.product}</td>
                  <td>{o.quantity} Units</td>
                  <td><span className={`badge bg-${o.payment_status === 'Paid' ? 'success' : 'warning'}`}>{o.payment_status}</span></td>
                  <td>₹ {o.total_price_including_gst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealerDashboard;
