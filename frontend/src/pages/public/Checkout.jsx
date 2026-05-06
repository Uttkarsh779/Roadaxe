import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Data passed from ProductDetail
  const { product, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    first_name: user?.firstName || '',
    last_name: user?.lastName || '',
    phone_number: user?.phone || '',
    email: user?.email || '',
    address: '',
    state: 'Odisha',
    city: 'Bhubaneswar',
    pincode: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [product, navigate]);

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const cities = ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Rourkela", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotals = () => {
    const actualPrice = product?.actual_price || 0;
    const totalprice = actualPrice * quantity;
    const gst_amount = Math.round(totalprice * 0.05);
    const totalprice_with_gst = totalprice + gst_amount;
    const totalbooking = 5000 * quantity; // Assuming fixed 5000 per unit booking
    
    return { totalprice, gst_amount, totalprice_with_gst, totalbooking };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderPayload = {
        ...formData,
        product: product.name,
        quantity,
        total_price: totals.totalprice,
        total_booking_amount: totals.totalbooking,
        total_price_including_gst: totals.totalprice_with_gst,
        GST_amount: totals.gst_amount
      };

      const res = await axios.post(`${API_URL}/api/orders/create`, orderPayload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      if (res.data.status === 'success') {
        // Navigate to /payment passing full order in state (Payment.jsx reads location.state.order)
        navigate('/payment', { state: { order: res.data.data.order } });
      }
    } catch (err) {
      console.error('Order creation error:', err);
      alert('Failed to initiate order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return '/static/assets/main/img/placeholder.webp';
    return img.startsWith('uploads') ? `${API_URL}/${img}` : `${API_URL}/uploads/${img}`;
  };

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <br />
      <section className="bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 mb-4">
              <div className="card shadow-0 border">
                <div className="p-4">
                  <h5 className="card-title mb-3">Checkout</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-6 mb-3">
                        <p className="mb-0">First name</p>
                        <input 
                          type="text" 
                          placeholder="Type here" 
                          className="form-control" 
                          name='first_name' 
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <p className="mb-0">Last name</p>
                        <input 
                          type="text" 
                          placeholder="Type here" 
                          className="form-control" 
                          name='last_name' 
                          value={formData.last_name}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <p className="mb-0">Phone</p>
                        <input 
                          type="tel" 
                          placeholder="+91 " 
                          className="form-control" 
                          name="phone_number" 
                          value={formData.phone_number}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <div className="col-6 mb-3">
                        <p className="mb-0">Email</p>
                        <input 
                          type="email" 
                          placeholder="example@gmail.com" 
                          className="form-control" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                    </div>

                    <hr className="my-4" />
                    <h5 className="card-title mb-3">Shipping info</h5>
                    <div className="row">
                      <div className="col-sm-8 mb-3">
                        <p className="mb-0">Address</p>
                        <input 
                          type="text" 
                          placeholder="Type here" 
                          className="form-control" 
                          name="address" 
                          value={formData.address}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <div className="col-sm-4 mb-3">
                        <p className="mb-0">State</p>
                        <select className="form-control" name="state" value={formData.state} onChange={handleChange} required>
                          {states.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="col-sm-4 mb-3">
                        <p className="mb-0">City</p>
                        <select className="form-control" name="city" value={formData.city} onChange={handleChange} required>
                          {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-sm-4 col-6 mb-3">
                        <p className="mb-0">Pin code</p>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="pincode" 
                          value={formData.pincode}
                          onChange={handleChange}
                          required 
                        />
                      </div>
                      <div className="mb-3">
                        <p className="mb-0">Message to Road Axe For your Order!</p>
                        <textarea 
                          className="form-control" 
                          rows="2" 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="float-end">
                        <button type="button" className="btn btn-light border me-2" onClick={() => navigate(-1)}>Cancel</button>
                        <button className="btn btn-success shadow-0 border" type="submit" disabled={loading}>
                          {loading ? 'Processing...' : 'Continue'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-xl-4 col-lg-4 d-flex justify-content-center justify-content-lg-end">
              <div className="ms-lg-4 mt-4 mt-lg-0" style={{ maxWidth: '320px' }}>
                <h6 className="mb-3">Summary</h6>
                <div className="d-flex justify-content-between">
                  <p className="mb-2">Total price:</p>
                  <p className="mb-2">₹ {totals.totalprice}</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="mb-2">GST(5%):</p>
                  <p className="mb-2 text-danger">₹ {totals.gst_amount}</p>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <p className="mb-2">Final Total:</p>
                  <p className="mb-2 fw-bold">₹ {totals.totalprice_with_gst}</p>
                </div>
                <br />
                <div className="d-flex justify-content-between">
                  <p className="mb-2">Booking Amount:</p>
                  <p className="mb-2 fw-bold text-success">₹ {totals.totalbooking}</p>
                </div>
                <hr />
                <h6 className="text-dark my-4">Items in cart</h6>
                <div className="d-flex align-items-center mb-4">
                  <div className="me-3 position-relative">
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                      1
                    </span>
                    <img src={getImageUrl(product?.image)} style={{ height: '96px', width: '96px' }} className="img-sm rounded border" alt={product?.name} />
                  </div>
                  <div className="">
                    <span className="nav-link p-0 fw-bold">{product?.name}</span>
                    <div className="price text-muted">QTY: {quantity} Unit</div>
                    <div className="price text-muted">Price: ₹ {product?.actual_price}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Checkout;
