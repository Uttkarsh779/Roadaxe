import React from 'react';
import PageHeader from '../../components/ui/PageHeader';

const Terms = () => {
  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="Terms & Conditions" breadcrumb={[{ label: 'Terms', active: true }]} />
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4 bg-white">
          <h2 className="mb-4">Standard Terms of Use</h2>
          <p className="lead">By accessing and using this website, you agree to be bound by these terms and conditions.</p>
          <hr />
          <h5>1. Intellectual Property</h5>
          <p>All content, trademarks, and data on this website, including software, databases, text, and graphics, are the property of Road Axe Motors Pvt Ltd.</p>
          <h5>2. Vehicle Bookings</h5>
          <p>Bookings made on this website are subject to availability and verification. The booking amount of ₹ 5000 is non-refundable unless specified otherwise.</p>
          <h5>3. User Conduct</h5>
          <p>Users must not use this website for any fraudulent or illegal activities. Any unauthorized access to the database or administrative areas is strictly prohibited.</p>
          <h5>4. Limitation of Liability</h5>
          <p>Road Axe Motors will not be liable for any indirect or consequential loss arising from the use of this website or the purchase of our vehicles through the online portal.</p>
        </div>
      </div>
    </>
  );
};

export default Terms;
