import React, { useState } from 'react';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/public/enquiry`, formData);
      setStatus('Success! We will get back to you shortly.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setStatus('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="Contact Us" breadcrumb={[{ label: 'Contact', active: true }]} />
      
      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded h-100">
                <h4 className="text-primary mb-4">Get In Touch</h4>
                <div className="d-flex mb-4">
                  <i className="fas fa-map-marker-alt fa-2x text-primary me-3"></i>
                  <div>
                    <h5>Address</h5>
                    <p>MIG-281, Kalinga Vihar, Patrapada, Bhubaneswar, 751019</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <i className="fas fa-envelope fa-2x text-primary me-3"></i>
                  <div>
                    <h5>Email</h5>
                    <p>info@roadx.com</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <i className="fas fa-phone-alt fa-2x text-primary me-3"></i>
                  <div>
                    <h5>Phone</h5>
                    <p>+91 9403890774</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded h-100 shadow-sm">
                <h4 className="text-primary mb-4">Send Message</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" rows="4" placeholder="Message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                    {status && <div className={`col-12 mt-3 alert ${status.includes('Success') ? 'alert-success' : 'alert-danger'}`}>{status}</div>}
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

export default Contact;
