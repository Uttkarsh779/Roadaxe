import React from 'react';
import PageHeader from '../../components/ui/PageHeader';

const Privacy = () => {
  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="Privacy Policy" breadcrumb={[{ label: 'Privacy', active: true }]} />
      <div className="container py-5">
        <div className="card border-0 shadow-sm p-4 bg-white">
          <h2 className="mb-4">How We Protect Your Data</h2>
          <p className="lead">Road Axe Motors Pvt Ltd is committed to ensuring that your privacy is protected.</p>
          <hr />
          <h5>1. Information Collection</h5>
          <p>We collect information when you register, place an order, or subscribe to our newsletter. This includes name, email, phone number, and shipping address.</p>
          <h5>2. Use of Information</h5>
          <p>The information we collect is used to process transactions, improve customer service, and send periodic emails about your order or our latest innovations.</p>
          <h5>3. Data Security</h5>
          <p>We implement a variety of security measures to maintain the safety of your personal information. All sensitive payment information is transmitted via Secure Socket Layer (SSL) technology through our payment gateway provider (Razorpay).</p>
          <h5>4. Third-Party Disclosure</h5>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent.</p>
        </div>
      </div>
    </>
  );
};

export default Privacy;
