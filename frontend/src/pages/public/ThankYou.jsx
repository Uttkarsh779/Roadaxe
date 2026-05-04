import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = ({ title, message }) => (
  <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
    <div className="card shadow-sm p-5 border-0 rounded">
      <div className="mb-4 text-success"><i className="fas fa-check-circle fa-5x"></i></div>
      <h1 className="display-4 fw-bold">{title || 'Thank You!'}</h1>
      <p className="lead text-muted mb-5">{message || 'We have received your request and will get back to you shortly.'}</p>
      <Link to="/" className="btn btn-primary btn-lg px-5 rounded-pill">Back to Home</Link>
    </div>
  </div>
);

export default ThankYou;
