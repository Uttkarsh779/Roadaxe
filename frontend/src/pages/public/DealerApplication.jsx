import React, { useState } from 'react';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const DealerApplication = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    pincode: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/public/dealership-enquiry`, formData);
      setStatus('Request submitted! Our team will contact you for verification.');
      setFormData({ name: '', email: '', phone_number: '', address: '', pincode: '' });
    } catch (err) {
      setStatus('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="Dealership Program" breadcrumb={[{ label: 'Dealership', active: true }]} />
      
      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded">
                <h4 className="text-primary mb-4">Benefits of Partnership</h4>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center text-center p-3">
                      <i className="fas fa-bolt fa-3x text-primary mb-3"></i>
                      <h6>Nationwide Presence</h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center text-center p-3">
                      <i className="fas fa-chart-line fa-3x text-primary mb-3"></i>
                      <h6>High Profitability</h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center text-center p-3">
                      <i className="fas fa-cogs fa-3x text-primary mb-3"></i>
                      <h6>Technical Support</h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex flex-column align-items-center text-center p-3">
                      <i className="fas fa-certificate fa-3x text-primary mb-3"></i>
                      <h6>Certified Quality</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded shadow-sm">
                <h4 className="text-primary mb-4">Apply for Dealership</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Business Name / Contact Name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Phone" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" rows="3" placeholder="Full Address" name="address" value={formData.address} onChange={handleChange} required></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                    {status && <div className={`col-12 mt-3 alert ${status.includes('Request') ? 'alert-success' : 'alert-danger'}`}>{status}</div>}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DealerApplication;
