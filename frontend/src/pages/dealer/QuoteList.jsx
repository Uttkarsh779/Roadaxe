import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QuoteList = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dealer/quotes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setQuotes(res.data.data.quotes);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, [API_URL]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0">My Quotations</h5>
        <Link to="/dealer/create-quote" className="btn btn-primary btn-sm">Request New</Link>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Quote #</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Estimated Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              ) : quotes.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No quotations found.</td></tr>
              ) : quotes.map(q => (
                <tr key={q._id}>
                  <td><strong>#{q.quote_id || q._id.slice(-6).toUpperCase()}</strong></td>
                  <td>{q.product}</td>
                  <td>{q.quantity}</td>
                  <td>{q.estimated_price ? `₹ ${q.estimated_price}` : 'Pending Admin Review'}</td>
                  <td><span className={`badge bg-${q.status === 'Quoted' ? 'success' : 'secondary'}`}>{q.status}</span></td>
                  <td>
                    {q.status === 'Quoted' && (
                      <Link to={`/dealer/checkout/${q._id}`} className="btn btn-sm btn-success">Proceed to Order</Link>
                    )}
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

export default QuoteList;
