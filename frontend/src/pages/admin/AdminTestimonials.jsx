import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    review: '',
    stars: 5
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/testimonials`);
      setTestimonials(res.data.data.testimonials);
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
    setFormData({ name: '', designation: '', review: '', stars: 5 });
    setImageFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      };

      if (editingId) {
        await axios.patch(`${API_URL}/api/admin/testimonials/${editingId}`, data, config);
        setMessage({ type: 'success', text: 'Testimonial updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/testimonials`, data, config);
        setMessage({ type: 'success', text: 'Testimonial added successfully!' });
      }
      resetForm();
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Action failed' });
    }
  };
  const handleEdit = (testimonial) => {
    setFormData({
      name: testimonial.name,
      designation: testimonial.designation,
      review: testimonial.review,
      stars: testimonial.stars || 5
    });
    setEditingId(testimonial._id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchTestimonials();
      } catch (err) {
        alert("Failed to delete testimonial");
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">Testimonials</h5>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-lg me-1"></i> Add Testimonial
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
                <div className="col-md-6 mb-3">
                  <label className="form-label">User Name*</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Designation*</label>
                  <input type="text" name="designation" className="form-control" value={formData.designation} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">User Image</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" style={{ height: '50px', width: '50px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Stars (1-5)</label>
                  <input type="number" name="stars" className="form-control" min="1" max="5" value={formData.stars} onChange={handleInputChange} />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Review*</label>
                  <textarea name="review" className="form-control" rows="3" value={formData.review} onChange={handleInputChange} required></textarea>
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success px-5">Save Testimonial</button>
                <button type="button" className="btn btn-secondary px-5" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>User</th>
                    <th>Designation</th>
                    <th>Review</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                  ) : testimonials.length === 0 ? (
                    <tr><td colSpan="5" className="text-center">No testimonials found.</td></tr>
                  ) : testimonials.map(t => (
                    <tr key={t._id}>
                      <td>
                        <img 
                          src={getImageUrl(t.image)} 
                          alt="" 
                          style={{ height: '40px', width: '40px', objectFit: 'cover' }} 
                          className="rounded-circle border"
                          onError={handleImageError} 
                        />
                      </td>
                      <td className="fw-bold">{t.name}</td>
                      <td>{t.designation}</td>
                      <td><div className="text-truncate" style={{maxWidth: '300px'}}>{t.review}</div></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(t)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>
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

export default AdminTestimonials;
