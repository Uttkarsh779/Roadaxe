import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { getImageUrl } from '../../utils/imageHelper';
import logo from '../../assets/RoadAxe_Transparent_Vertical.png';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/admin-login`, { email, password });
      if (res.data.status === 'success') {
        login(res.data.data.user, res.data.token);
        navigate('/dash');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light vh-100 d-flex align-items-center justify-content-center">
      <link rel="stylesheet" href="/static/assets/dash/css/bootstrap.css" />
      <div className="card shadow border-0" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <img src={logo} style={{ height: '120px' }} alt="Road Axe Logo" />
            <h4 className="mt-3">Road Axe Admin</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="mb-2">Email</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group mb-4">
              <label className="mb-2">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <div className="alert alert-danger py-2 mt-3">{error}</div>}
            <button className="btn btn-primary w-100 py-2" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
