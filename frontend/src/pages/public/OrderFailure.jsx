import React from 'react';
import { Link } from 'react-router-dom';

const OrderFailure = () => {
  return (
    <>
      <div className="container-fluid" style={{ height: '120px' }}></div>
      <div className="container text-center py-5">
        <div className="card border-0 shadow-sm p-5 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="mb-4">
            <i className="fas fa-times-circle text-danger" style={{ fontSize: '100px' }}></i>
          </div>
          <h1 className="display-4 fw-bold text-dark">Payment Failed</h1>
          <p className="lead text-muted mb-4">
            We're sorry, but your transaction could not be processed. This might be due to a technical error or insufficient funds.
          </p>
          <div className="alert alert-warning mb-4">
            If any amount was debited from your account, it will be refunded automatically within 5-7 business days.
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Link to="/products" className="btn btn-primary btn-lg px-5">Try Again</Link>
            <Link to="/contact" className="btn btn-outline-secondary btn-lg px-5">Contact Support</Link>
          </div>
        </div>
      </div>
      <div style={{ height: '100px' }}></div>
    </>
  );
};

export default OrderFailure;
