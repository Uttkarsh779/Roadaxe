import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    designation: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/team`);
      setEmployees(res.data.data.team);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', designation: '' });
    setImageFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('designation', formData.designation);
    if (imageFile) {
      console.log('Appending image to FormData:', imageFile.name);
      data.append('image', imageFile);
    }

    console.log('Submitting Employee Data to:', `${API_URL}/api/admin/employees${editingId ? '/' + editingId : ''}`);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      };
      
      console.log('Submitting Employee Form...', { editingId, formData });

      let res;
      if (editingId) {
        res = await axios.patch(`${API_URL}/api/admin/employees/${editingId}`, data, config);
        setMessage({ type: 'success', text: 'Employee updated successfully!' });
      } else {
        res = await axios.post(`${API_URL}/api/admin/employees`, data, config);
        setMessage({ type: 'success', text: 'Employee added successfully!' });
      }
      console.log('API RESPONSE:', res.data);
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Action failed' });
    }
  };
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      designation: employee.designation
    });
    setEditingId(employee._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/employees/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchEmployees();
      } catch (err) {
        alert("Failed to delete employee");
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Employee Management</h5>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <i className="bi bi-person-plus me-1"></i> Add Employee
            </button>
          )}
        </div>
        
        <div className="card-body">
          {message.text && (
            <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
              {message.text}
              <button type="button" className="btn-close" onClick={() => setMessage({type:'', text:''})}></button>
            </div>
          )}

          {showForm ? (
            <form onSubmit={handleSubmit} className="mb-5 bg-light p-4 rounded border">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Full Name*</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Designation*</label>
                  <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Profile Image {!editingId && '*'}</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" required={!editingId} />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" style={{ height: '80px', width: '80px', objectFit: 'cover' }} className="rounded border" />
                      <small className="d-block text-muted">New image preview</small>
                    </div>
                  )}
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success px-5">Save Employee</button>
                <button type="button" className="btn btn-secondary px-5" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : employees.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No employees found.</td></tr>
                  ) : employees.map(e => (
                    <tr key={e._id}>
                      <td>
                        <img 
                          src={getImageUrl(e.image)} 
                          alt="" 
                          style={{ height: '45px', width: '45px', objectFit: 'cover' }} 
                          className="rounded-circle border"
                          onError={handleImageError} 
                        />
                      </td>
                      <td className="fw-bold">{e.name}</td>
                      <td>{e.designation}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(e)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e._id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmployees;
