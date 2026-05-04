import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const { order } = location.state || {};

  return (
    <>
      <div className="container-fluid" style={{ height: '120px' }}></div>
      <div className="container text-center py-5">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="mb-4">
            <i className="fas fa-check-circle text-success" style={{ fontSize: '100px' }}></i>
          </div>
          <h1 className="display-4 fw-bold text-dark">Order Confirmed!</h1>
          <p className="lead text-muted mb-4">
            Thank you for choosing Road Axe. Your booking for <strong>{order?.product || 'your product'}</strong> has been successfully placed.
          </p>
          <div className="bg-light p-3 rounded mb-4">
            <p className="mb-1">Order ID: <strong>{order?.razorpay_order_id || 'N/A'}</strong></p>
            <p className="mb-0">Invoice Number: <strong>#{order?.invoice_number || 'N/A'}</strong></p>
          </div>
          <p className="text-muted mb-5">
            A confirmation email has been sent to <strong>{order?.email}</strong>. Our team will contact you shortly for the next steps.
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Link to="/" className="btn btn-primary btn-lg px-5">Go to Home</Link>
            <Link to="/products" className="btn btn-outline-secondary btn-lg px-5">Browse More</Link>
          </div>
        </div>
      </div>
      <div style={{ height: '100px' }}></div>
    </>
  );
};

export default OrderSuccess;
