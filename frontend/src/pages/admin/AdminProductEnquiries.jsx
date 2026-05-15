import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '';
const AUTH = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: '#fef3c7', color: '#92400e', dot: '#f59e0b' },
  contacted: { label: 'Contacted', bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6' },
  converted: { label: 'Converted', bg: '#dcfce7', color: '#14532d', dot: '#22c55e' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
      {cfg.label}
    </span>
  );
};

const AdminProductEnquiries = () => {
  const [enquiries, setEnquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [selected, setSelected]     = useState(null); // detail modal
  const [updating, setUpdating]     = useState(null);

  useEffect(() => { fetchEnquiries(); }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/product-enquiries`, AUTH());
      setEnquiries(res.data.data.enquiries);
    } catch (err) {
      console.error('Failed to fetch product enquiries:', err);
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await axios.patch(`${API_URL}/api/admin/product-enquiries/${id}/status`, { status: newStatus }, AUTH());
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
      if (selected?._id === id) setSelected(s => ({ ...s, status: newStatus }));
    } catch (err) {
      alert('Failed to update status.');
    } finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry? This cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/product-enquiries/${id}`, AUTH());
      setEnquiries(prev => prev.filter(e => e._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch (err) {
      alert('Failed to delete enquiry.');
    }
  };

  const filtered = filter === 'all' ? enquiries : enquiries.filter(e => e.status === filter);

  const counts = {
    all: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 fw-bold" style={{ color: '#1a1a2e' }}>Product Enquiries</h4>
          <p className="text-muted mb-0" style={{ fontSize: '13px' }}>Verified lead enquiries from the product pages</p>
        </div>
        <button className="btn btn-outline-secondary btn-sm" onClick={fetchEnquiries}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="row g-3 mb-4">
        {Object.entries(counts).map(([key, val]) => (
          <div key={key} className="col-6 col-md-3">
            <div
              className="card border-0 shadow-sm text-center py-3"
              style={{ cursor: 'pointer', borderBottom: filter === key ? '3px solid #4a6cf7' : '3px solid transparent', transition: 'all 0.2s' }}
              onClick={() => setFilter(key)}
            >
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#1a1a2e' }}>{val}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize', fontWeight: 600 }}>{key === 'all' ? 'Total' : key}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{ background: '#f8faff' }}>
                <tr>
                  <th className="ps-4 py-3" style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Customer</th>
                  <th style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Product</th>
                  <th style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Contact</th>
                  <th style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Status</th>
                  <th style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Date</th>
                  <th style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-5 text-muted">No enquiries found.</td></tr>
                ) : filtered.map(e => (
                  <tr key={e._id} style={{ cursor: 'pointer' }} onClick={() => setSelected(e)}>
                    <td className="ps-4">
                      <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{e.fullName}</div>
                      {e.companyName && <div style={{ fontSize: '12px', color: '#6b7280' }}>{e.companyName}</div>}
                    </td>
                    <td>
                      <span style={{ background: '#f0f4ff', color: '#4a6cf7', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                        {e.productName}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px' }}><a href={`mailto:${e.email}`} onClick={ev => ev.stopPropagation()} style={{ color: '#4a6cf7', textDecoration: 'none' }}>{e.email}</a></div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{e.phone}</div>
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td style={{ fontSize: '13px', color: '#6b7280' }}>
                      {new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td onClick={ev => ev.stopPropagation()}>
                      <select
                        className="form-select form-select-sm me-2"
                        style={{ width: '120px', display: 'inline-block', fontSize: '12px' }}
                        value={e.status}
                        onChange={ev => handleStatusChange(e._id, ev.target.value)}
                        disabled={updating === e._id}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(e._id)} title="Delete">
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

      {/* ── Detail Modal ── */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={() => setSelected(null)}>
          <div style={{ background: '#fff', borderRadius: '16px', maxWidth: '540px', width: '100%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', padding: '20px 24px', borderRadius: '16px 16px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h5 style={{ color: '#fff', margin: 0 }}>{selected.fullName}</h5>
                <div style={{ color: '#a0aec0', fontSize: '13px', marginTop: '4px' }}>{selected.productName}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <StatusBadge status={selected.status} />
                <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setSelected(null)}>✕</button>
              </div>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {[
                  ['Email', <a href={`mailto:${selected.email}`} style={{ color: '#4a6cf7' }}>{selected.email} ✓</a>],
                  ['Phone', selected.phone],
                  ['Company', selected.companyName || '—'],
                  ['Submitted', new Date(selected.createdAt).toLocaleString('en-IN')],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '14px', color: '#1a1a2e', fontWeight: 500 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: '#f8faff', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Message / Requirement</div>
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.7, fontSize: '14px' }}>{selected.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select className="form-select form-select-sm flex-grow-1"
                  value={selected.status}
                  onChange={e => handleStatusChange(selected._id, e.target.value)}
                  disabled={updating === selected._id}
                >
                  <option value="pending">Mark as Pending</option>
                  <option value="contacted">Mark as Contacted</option>
                  <option value="converted">Mark as Converted</option>
                </select>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(selected._id)}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
                <a href={`mailto:${selected.email}?subject=Re: Enquiry for ${selected.productName}`} className="btn btn-sm btn-primary">
                  <i className="bi bi-envelope me-1"></i>Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductEnquiries;
