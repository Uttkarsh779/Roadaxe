import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateQuote = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    product: '',
    quantity: 1,
    message: ''
  });
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/public/products?type=dealership`);
        setProducts(res.data.data.products);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/dealer/quotes`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert("Quotation request sent successfully!");
      navigate('/dealer/quotes');
    } catch (err) {
      alert("Failed to send quotation request.");
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Get New Quotation</h5>
      </div>
      <div className="card-body p-4">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Select Product</label>
              <select className="form-control" name="product" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} required>
                <option value="">Choose a vehicle...</option>
                {products.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Quantity</label>
              <input type="number" className="form-control" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
            </div>
            <div className="col-12">
              <label className="form-label">Additional Message</label>
              <textarea className="form-control" rows="4" placeholder="Any specific requirements?" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
            </div>
            <div className="col-12">
              <button className="btn btn-primary btn-lg px-5" type="submit">Submit Request</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuote;
