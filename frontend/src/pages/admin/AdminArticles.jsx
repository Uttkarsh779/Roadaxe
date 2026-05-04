import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: ''
  });

  const [files, setFiles] = useState({
    banner_image: null,
    thumbnail_image: null
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/articles`);
      setArticles(res.data.data.articles);
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
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', content: '',
      meta_title: '', meta_description: '', meta_keywords: ''
    });
    setFiles({ banner_image: null, thumbnail_image: null });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (files.banner_image) data.append('banner_image', files.banner_image);
    if (files.thumbnail_image) data.append('thumbnail_image', files.thumbnail_image);

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      };

      if (editingId) {
        await axios.patch(`${API_URL}/api/admin/articles/${editingId}`, data, config);
        setMessage({ type: 'success', text: 'Article updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/articles`, data, config);
        setMessage({ type: 'success', text: 'Article created successfully!' });
      }
      resetForm();
      fetchArticles();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const startEdit = (a) => {
    setFormData({
      title: a.title,
      description: a.description || '',
      content: a.content || '',
      meta_title: a.meta_title || '',
      meta_description: a.meta_description || '',
      meta_keywords: a.meta_keywords || ''
    });
    setEditingId(a._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/articles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchArticles();
      } catch (err) {
        alert("Failed to delete article");
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">{editingId ? 'Edit Article' : 'Article Management'}</h5>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-lg me-1"></i> Add Article
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
                <div className="col-md-12 mb-3">
                  <label className="form-label">Article Title*</label>
                  <input type="text" name="title" className="form-control" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Banner Image</label>
                  <input type="file" name="banner_image" className="form-control" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Thumbnail Image</label>
                  <input type="file" name="thumbnail_image" className="form-control" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Short Description</label>
                  <textarea name="description" className="form-control" rows="2" value={formData.description} onChange={handleInputChange}></textarea>
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Content (HTML)*</label>
                  <textarea name="content" className="form-control" rows="10" value={formData.content} onChange={handleInputChange} required></textarea>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Title</label>
                  <input type="text" name="meta_title" className="form-control" value={formData.meta_title} onChange={handleInputChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Keywords</label>
                  <input type="text" name="meta_keywords" className="form-control" value={formData.meta_keywords} onChange={handleInputChange} />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Meta Description</label>
                  <input type="text" name="meta_description" className="form-control" value={formData.meta_description} onChange={handleInputChange} />
                </div>
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success px-5">
                  {editingId ? 'Update' : 'Create'} Article
                </button>
                <button type="button" className="btn btn-secondary px-5" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center">Loading...</td></tr>
                  ) : articles.length === 0 ? (
                    <tr><td colSpan="4" className="text-center">No articles found.</td></tr>
                  ) : articles.map(a => (
                    <tr key={a._id}>
                      <td>
                        <img 
                          src={getImageUrl(a.thumbnail_image)} 
                          alt="" 
                          style={{ height: '40px', width: '60px', objectFit: 'cover' }} 
                          className="rounded border"
                          onError={handleImageError} 
                        />
                      </td>
                      <td className="fw-bold">{a.title}</td>
                      <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(a)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a._id)}>
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

export default AdminArticles;
