import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDealerEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/dealership-enquiries`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEnquiries(res.data.data.enquiries);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`${API_URL}/api/admin/dealership-enquiries/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchEnquiries();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Dealership Applications</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Applicant</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : enquiries.map(e => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.city || 'N/A'}, {e.pincode}</td>
                  <td>{e.email}<br/>{e.phone_number}</td>
                  <td>
                    <span className={`badge bg-${e.status === 'Approved' ? 'success' : e.status === 'Rejected' ? 'danger' : 'warning'}`}>
                      {e.status || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-success me-1" onClick={() => handleStatusChange(e._id, 'Approved')}>Approve</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleStatusChange(e._id, 'Rejected')}>Reject</button>
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

export default AdminDealerEnquiries;
