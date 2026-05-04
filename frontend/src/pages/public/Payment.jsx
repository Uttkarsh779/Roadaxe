import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!order) {
      navigate('/products');
      return;
    }

    // Load Razorpay Script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [order, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Razorpay Order on Backend
      const res = await axios.post(`${API_URL}/api/orders/razorpay-order`, {
        orderId: order._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const { rzpOrderId, amount, currency, key } = res.data.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Road Axe Motors Pvt Ltd",
        description: `Booking for ${order.product}`,
        image: "/static/assets/main/roadxlogo.png",
        order_id: rzpOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment on Backend
            const verifyRes = await axios.post(`${API_URL}/api/orders/verify-payment`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              dbOrderId: order._id
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (verifyRes.data.status === 'success') {
              navigate('/order-success', { state: { order: verifyRes.data.data.order } });
            } else {
              navigate('/order-failure');
            }
          } catch (err) {
            console.error('Payment verification failed:', err);
            navigate('/order-failure');
          }
        },
        prefill: {
          name: `${order.first_name} ${order.last_name}`,
          email: order.email,
          contact: order.phone_number
        },
        theme: {
          color: "#00d084"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay initialization failed:', err);
      alert('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <div className="container py-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
            <h5 className="mb-0">Invoice <strong>#{order.invoice_number}</strong></h5>
            <button className="btn btn-sm btn-outline-secondary d-print-none" onClick={() => window.print()}>
              <i className="fa fa-print me-1"></i> Print
            </button>
          </div>
          <div className="card-body p-4">
            <div className="row mb-5">
              <div className="col-sm-4">
                <h6 className="text-muted mb-3">From:</h6>
                <img src="/static/assets/main/roadxlogo.png" style={{ height: '40px', marginBottom: '15px' }} alt="Road Axe Motors" />
                <div className="fw-bold">Road Axe Motors Pvt Ltd</div>
                <div>MIG-281, Kalinga Vihar, Patrapada</div>
                <div>Bhubaneswar, Odisha - 751019</div>
                <div>Email: info@roadx.com</div>
              </div>
              <div className="col-sm-4">
                <h6 className="text-muted mb-3">To:</h6>
                <div className="fw-bold">{order.first_name} {order.last_name}</div>
                <div>{order.address}</div>
                <div>{order.city}, {order.state} - {order.pincode}</div>
                <div>Email: {order.email}</div>
                <div>Phone: +91 {order.phone_number}</div>
              </div>
              <div className="col-sm-4 text-sm-end">
                <h6 className="text-muted mb-3">Details:</h6>
                <div>Date: {new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="fw-bold text-primary mt-2">Status: {order.payment_status}</div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped border">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Item</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-end">Booking Amount</th>
                    <th className="text-end">Full Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{order.product}</td>
                    <td className="text-center">{order.quantity}</td>
                    <td className="text-end">₹ {order.total_booking_amount}</td>
                    <td className="text-end">₹ {order.total_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="row mt-4">
              <div className="col-lg-6"></div>
              <div className="col-lg-6">
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td className="text-start">GST (5%)</td>
                      <td className="text-end">₹ {order.GST_amount}</td>
                    </tr>
                    <tr className="border-top">
                      <td className="text-start fw-bold">Grand Total</td>
                      <td className="text-end fw-bold">₹ {order.total_price_including_gst}</td>
                    </tr>
                    <tr className="table-success mt-2">
                      <td className="text-start fw-bold h5">Amount to Pay Now</td>
                      <td className="text-end fw-bold h5 text-success">₹ {order.total_booking_amount}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-end mt-4 d-print-none">
                  <button 
                    id="rzp-button1" 
                    className="btn btn-primary btn-lg px-5 shadow"
                    onClick={handlePayment}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '50px' }}></div>
    </>
  );
};

export default Payment;
