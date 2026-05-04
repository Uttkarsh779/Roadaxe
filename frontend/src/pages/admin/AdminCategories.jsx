import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/categories`);
      setCategories(res.data.data.categories);
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
    setFormData({
      title: '',
      description: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: ''
    });
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
        await axios.patch(`${API_URL}/api/admin/categories/${editingId}`, data, config);
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/categories`, data, config);
        setMessage({ type: 'success', text: 'Category created successfully!' });
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const startEdit = (c) => {
    setFormData({
      title: c.title,
      description: c.description || '',
      meta_title: c.meta_title || '',
      meta_description: c.meta_description || '',
      meta_keywords: c.meta_keywords || ''
    });
    setEditingId(c._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/categories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchCategories();
      } catch (err) {
        alert("Failed to delete category");
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">{editingId ? 'Edit Category' : 'Category Management'}</h5>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-lg me-1"></i> Add Category
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
                  <label className="form-label">Title*</label>
                  <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Image</label>
                  <input type="file" className="form-control" onChange={handleFileChange} accept="image/*" />
                  {previewUrl && (
                    <div className="mt-2">
                      <img src={previewUrl} alt="Preview" style={{ height: '50px', width: '50px', objectFit: 'cover' }} className="rounded border" />
                    </div>
                  )}
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Description*</label>
                  <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleInputChange} required></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Title</label>
                  <input type="text" name="meta_title" className="form-control" value={formData.meta_title} onChange={handleInputChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Description</label>
                  <input type="text" name="meta_description" className="form-control" value={formData.meta_description} onChange={handleInputChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Keywords</label>
                  <input type="text" name="meta_keywords" className="form-control" value={formData.meta_keywords} onChange={handleInputChange} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success px-4">
                  {editingId ? 'Update' : 'Create'} Category
                </button>
                <button type="button" className="btn btn-secondary px-4" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : categories.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No categories found.</td></tr>
                  ) : categories.map(c => (
                    <tr key={c._id}>
                      <td>
                        <img 
                          src={getImageUrl(c.image)} 
                          alt={c.title} 
                          style={{ height: '40px', width: '40px', objectFit: 'cover' }} 
                          className="rounded border"
                          onError={handleImageError} 
                        />
                      </td>
                      <td className="fw-bold">{c.title}</td>
                      <td><div className="text-truncate" style={{maxWidth: '200px'}}>{c.description}</div></td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(c)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c._id)}>
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

export default AdminCategories;
