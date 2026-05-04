import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/enquiries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnquiries(res.data.data.enquiries);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin/enquiries/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnquiries(enquiries.filter(e => e._id !== id));
    } catch (err) { alert('Failed to delete'); }
  };

  const handleAttend = async (id) => {
    try {
      await axios.patch(`${API_URL}/api/admin/enquiries/${id}/attend`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnquiries(enquiries.map(e => e._id === id ? { ...e, status: 'Completed' } : e));
    } catch (err) { alert('Failed to update'); }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">General Enquiries</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Subject & Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              ) : enquiries.length === 0 ? (
                <tr><td colSpan="6" className="text-center">No enquiries found.</td></tr>
              ) : enquiries.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}<br/><small>{e.phone_number}</small></td>
                  <td><strong>{e.subject}</strong><br/><small>{e.message}</small></td>
                  <td>
                    <span className={`badge bg-${e.status === 'Completed' ? 'success' : 'warning'}`}>
                      {e.status || 'Pending'}
                    </span>
                  </td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td>
                    {e.status !== 'Completed' && (
                      <button className="btn btn-sm btn-outline-success me-2" onClick={() => handleAttend(e._id)}>
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e._id)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
