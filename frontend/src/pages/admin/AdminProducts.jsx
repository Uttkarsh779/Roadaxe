import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    booking_price: '',
    actual_price: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    highlight_1: '',
    highlight_2: '',
    highlight_3: '',
    highlight_4: '',
    highlight_5: '',
    highlight_6: '',
    spec1: '', spec1ans: '',
    spec2: '', spec2ans: '',
    spec3: '', spec3ans: '',
    spec4: '', spec4ans: '',
    spec5: '', spec5ans: '',
    spec6: '', spec6ans: '',
    spec7: '', spec7ans: '',
    spec8: '', spec8ans: '',
    spec9: '', spec9ans: '',
    spec10: '', spec10ans: '',
    brochure: '',
  });

  const [files, setFiles] = useState({
    image: null,
    highlight_1_icon: null,
    highlight_2_icon: null,
    highlight_3_icon: null,
    highlight_4_icon: null,
    highlight_5_icon: null,
    highlight_6_icon: null,
    brochure: null,
  });

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/products`);
      setProducts(res.data.data.products);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/public/categories`);
      setCategories(res.data.data.categories);
    } catch (err) {
      console.error(err);
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
      name: '', category: '', subcategory: '', description: '', booking_price: '', actual_price: '',
      meta_title: '', meta_description: '', meta_keywords: '',
      highlight_1: '', highlight_2: '', highlight_3: '', highlight_4: '', highlight_5: '', highlight_6: '',
      spec1: '', spec1ans: '', spec2: '', spec2ans: '', spec3: '', spec3ans: '', spec4: '', spec4ans: '', spec5: '', spec5ans: '',
      spec6: '', spec6ans: '', spec7: '', spec7ans: '', spec8: '', spec8ans: '', spec9: '', spec9ans: '', spec10: '', spec10ans: '', brochure: '',
    });
    setFiles({
      image: null, highlight_1_icon: null, highlight_2_icon: null, highlight_3_icon: null, highlight_4_icon: null, highlight_5_icon: null, highlight_6_icon: null, brochure: null,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      const config = {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      };

      if (editingId) {
        await axios.patch(`${API_URL}/api/admin/products/${editingId}`, data, config);
        setMessage({ type: 'success', text: 'Product updated successfully!' });
      } else {
        await axios.post(`${API_URL}/api/admin/products`, data, config);
        setMessage({ type: 'success', text: 'Product created successfully!' });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Action failed' });
    }
  };

  const startEdit = (p) => {
    const editData = {};
    Object.keys(formData).forEach(key => {
      editData[key] = p[key] || '';
    });
    setFormData(editData);
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchProducts();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0">{editingId ? 'Edit Product' : 'Product Management'}</h5>
          {!showForm && (
            <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
              <i className="bi bi-plus-lg me-1"></i> Add Product
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
                  <label className="form-label">Product Name*</label>
                  <input type="text" name="name" className="form-control" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Category*</label>
                  <select name="category" className="form-select" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.title}>{c.title}</option>)}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Subcategory</label>
                  <input type="text" name="subcategory" className="form-control" value={formData.subcategory} onChange={handleInputChange} />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Actual Price*</label>
                  <input type="number" name="actual_price" className="form-control" value={formData.actual_price} onChange={handleInputChange} required />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Booking Price*</label>
                  <input type="number" name="booking_price" className="form-control" value={formData.booking_price} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <input type="file" name="image" className="form-control" onChange={handleFileChange} accept="image/*" />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Product Brochure (PDF)</label>
                  <input type="file" name="brochure" className="form-control" onChange={handleFileChange} accept=".pdf" />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Description*</label>
                  <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleInputChange} required></textarea>
                </div>

                <div className="col-12"><hr /><h6>SEO Metadata</h6></div>
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
                  <textarea name="meta_description" className="form-control" rows="1" value={formData.meta_description} onChange={handleInputChange}></textarea>
                </div>

                <div className="col-12"><hr /><h6>Highlights & Icons</h6></div>
                {[1,2,3,4,5,6].map(num => (
                  <React.Fragment key={num}>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Highlight {num}</label>
                      <input type="text" name={`highlight_${num}`} className="form-control" value={formData[`highlight_${num}`]} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-2 mb-3">
                      <label className="form-label">Icon {num}</label>
                      <input type="file" name={`highlight_${num}_icon`} className="form-control form-control-sm" onChange={handleFileChange} accept="image/*" />
                    </div>
                  </React.Fragment>
                ))}

                <div className="col-12"><hr /><h6>Technical Specifications</h6></div>
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <div className="col-md-6 mb-2" key={num}>
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">Spec {num}</span>
                      <input type="text" name={`spec${num}`} placeholder="Label" className="form-control" value={formData[`spec${num}`]} onChange={handleInputChange} />
                      <input type="text" name={`spec${num}ans`} placeholder="Value" className="form-control" value={formData[`spec${num}ans`]} onChange={handleInputChange} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-success px-5">
                  {editingId ? 'Update' : 'Create'} Product
                </button>
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
                    <th>Category</th>
                    <th>Price</th>
                    <th>Brochure</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                  ) : products.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No products found.</td></tr>
                  ) : products.map(p => (
                    <tr key={p._id}>
                      <td>
                        <img 
                          src={getImageUrl(p.image)} 
                          alt={p.name} 
                          style={{ height: '40px', width: '40px', objectFit: 'cover' }} 
                          className="rounded border"
                          onError={handleImageError} 
                        />
                      </td>
                      <td className="fw-bold">{p.name}</td>
                      <td><span className="badge bg-light text-dark border">{p.category}</span></td>
                      <td>₹ {p.actual_price}</td>
                      <td>
                        {p.brochure ? (
                          <span className="badge bg-success">PDF</span>
                        ) : (
                          <span className="badge bg-secondary">None</span>
                        )}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(p)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
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

export default AdminProducts;
