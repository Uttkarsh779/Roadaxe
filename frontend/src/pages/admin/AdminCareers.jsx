import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageHelper';

const AdminCareers = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/career-applications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setApplications(res.data.data.applications);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [API_URL]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white py-3">
        <h5 className="mb-0">Career Applications</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Applicant</th>
                <th>Position</th>
                <th>Resume</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : applications.map(a => (
                <tr key={a._id}>
                  <td><strong>{a.name}</strong><br/><small>{a.email}</small></td>
                  <td>{a.position_applied}</td>
                  <td>
                    <a href={getImageUrl(a.resume)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                      <i className="bi bi-file-earmark-pdf me-1"></i> View Resume
                    </a>
                  </td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger"><i className="bi bi-trash"></i></button>
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

export default AdminCareers;
