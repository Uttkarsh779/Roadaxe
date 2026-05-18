import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageHelper';
import logo from '../../assets/RoadAxe_Transparent_Horizontal.png';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: 'bi-grid-fill', link: '/dash' },
    { label: 'Categories', icon: 'bi-box-seam', link: '/dash/category' },
    { label: 'Products', icon: 'bi-box-seam', link: '/dash/product' },
    { label: 'Articles', icon: 'bi-journal-text', link: '/dash/articles' },
    { label: 'Testimonials', icon: 'bi-chat-left-quote', link: '/dash/testimonials' },
    { label: 'Employees', icon: 'bi-person-badge', link: '/dash/employee' },
    { label: 'Enquiries', icon: 'bi-envelope', link: '/dash/enquiries' },
    { label: 'Product Enquiries', icon: 'bi-chat-square-text-fill', link: '/dash/product-enquiries' },
    { label: 'Orders', icon: 'bi-box', link: '/dash/customerorders' },
    { label: 'Dealership Enquiry', icon: 'bi-shop', link: '/dash/dealershipenquires' },
    { label: 'Career Applications', icon: 'bi-briefcase', link: '/dash/career' },
  ];

  return (
    <div id="app">
      <link rel="stylesheet" href="/static/assets/dash/css/bootstrap.css" />
      <link rel="stylesheet" href="/static/assets/dash/vendors/bootstrap-icons/bootstrap-icons.css" />
      <link rel="stylesheet" href="/static/assets/dash/css/app.css" />

      <div id="sidebar" className="active">
        <div className="sidebar-wrapper active shadow">
          <div className="sidebar-header">
            <div className="d-flex justify-content-between">
              <div className="logo">
                <Link to="/"><img src={logo} alt="Logo" style={{ height: '70px' }} /></Link>
              </div>
            </div>
          </div>
          <div className="sidebar-menu">
            <ul className="menu">
              <li className="sidebar-title">Menu</li>
              {menuItems.map(item => (
                <li key={item.link} className={`sidebar-item ${location.pathname === item.link ? 'active' : ''}`}>
                  <Link to={item.link} className='sidebar-link'>
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="sidebar-item">
                <button onClick={handleLogout} className='sidebar-link btn btn-link w-100 text-start border-0'>
                  <i className="bi bi-power text-danger"></i>
                  <span className="text-danger">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div id="main" className="p-4" style={{ minHeight: '100vh' }}>
        <header className="mb-3 d-flex justify-content-between align-items-center">
          <button className="btn d-xl-none"><i className="bi bi-justify fs-3"></i></button>
          <h3 className="mb-0">Admin Panel</h3>
        </header>

        <div className="page-content">
          <Outlet />
        </div>

        <footer className="mt-5 pt-3 border-top">
          <div className="footer clearfix mb-0 text-muted">
            <div className="float-start">
              <p>2024 &copy; Road Axe Admin</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
