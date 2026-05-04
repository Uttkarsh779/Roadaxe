import React, { useState } from 'react';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const Careers = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position_applied: '',
    cover_letter: ''
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (resume) data.append('resume', resume);

    try {
      await axios.post(`${API_URL}/api/public/career`, data);
      setStatus('Application submitted successfully!');
      setFormData({ name: '', email: '', phone: '', position_applied: '', cover_letter: '' });
      setResume(null);
    } catch (err) {
      setStatus('Failed to submit application. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="Careers" breadcrumb={[{ label: 'Career', active: true }]} />
      
      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded">
                <h4 className="text-primary mb-4">Join Our Team</h4>
                <p>Road Axe is looking for passionate individuals to join the electric revolution. If you have the drive to innovate and create sustainable impact, we want to hear from you.</p>
                <ul className="list-unstyled mt-4">
                  <li className="mb-3"><i className="fas fa-check-circle text-primary me-2"></i> Innovative Work Environment</li>
                  <li className="mb-3"><i className="fas fa-check-circle text-primary me-2"></i> Growth Opportunities</li>
                  <li className="mb-3"><i className="fas fa-check-circle text-primary me-2"></i> Sustainable Impact</li>
                </ul>
              </div>
            </div>
            <div className="col-xl-6">
              <div className="bg-light p-5 rounded shadow-sm">
                <h4 className="text-primary mb-4">Apply Now</h4>
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Position" name="position_applied" value={formData.position_applied} onChange={handleChange} required />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" rows="4" placeholder="Cover Letter" name="cover_letter" value={formData.cover_letter} onChange={handleChange}></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Resume (PDF/DOC)</label>
                      <input type="file" className="form-control" onChange={handleFileChange} required />
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary w-100 py-3" type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
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

export default Careers;
