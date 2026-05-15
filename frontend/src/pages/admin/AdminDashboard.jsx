import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    enquiries: 0,
    dealers: 0
  });

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    // Fetch dashboard stats (stub for now, but following pattern)
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(res.data.data);
      } catch (err) {
        console.error("Error fetching stats");
      }
    };
    fetchStats();
  }, [API_URL]);

  return (
    <div className="row">
      <div className="col-12 col-lg-3 col-md-6">
        <div className="card shadow-sm">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon purple mb-2"><i className="bi bi-box-seam text-white"></i></div>
              </div>
              <div className="col-md-8">
                <h6 className="text-dark font-semibold">Total Products</h6>
                <h6 className="font-extrabold mb-0">{stats.products || 'Loading...'}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-6">
        <div className="card shadow-sm">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon blue mb-2"><i className="bi bi-cart-fill text-white"></i></div>
              </div>
              <div className="col-md-8">
                <h6 className="text-dark font-semibold">Orders</h6>
                <h6 className="font-extrabold mb-0">{stats.orders || '0'}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-6">
        <div className="card shadow-sm">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon green mb-2"><i className="bi bi-envelope-fill text-white"></i></div>
              </div>
              <div className="col-md-8">
                <h6 className="text-dark font-semibold">Enquiries</h6>
                <h6 className="font-extrabold mb-0">{stats.enquiries || '0'}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-6">
        <div className="card shadow-sm">
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon red mb-2"><i className="bi bi-shop text-white"></i></div>
              </div>
              <div className="col-md-8">
                <h6 className="text-dark font-semibold">Dealers</h6>
                <h6 className="font-extrabold mb-0">{stats.dealers || '0'}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 col-lg-3 col-md-6">
        <div className="card shadow-sm" style={{ borderLeft: '3px solid #4a6cf7' }}>
          <div className="card-body px-3 py-4-5">
            <div className="row">
              <div className="col-md-4">
                <div className="stats-icon purple mb-2"><i className="bi bi-chat-square-text-fill text-white"></i></div>
              </div>
              <div className="col-md-8">
                <h6 className="text-dark font-semibold">Product Enquiries</h6>
                <h6 className="font-extrabold mb-0">{stats.productEnquiries ?? '0'}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
