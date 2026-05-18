import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getImageUrl } from '../../utils/imageHelper';

const DealerLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'My Orders', icon: 'bi-grid-fill', link: '/dealership' },
    { label: 'Get Quotation', icon: 'bi-journal-text', link: '/dealership/addquote' },
    { label: 'My Quotations', icon: 'bi-chat-left-quote', link: '/dealership/myquotes' },
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
                <Link to="/"><img src={getImageUrl('/static/assets/main/RoadAxe_Transparent_Horizontal.png')} alt="Road Axe" style={{ height: '70px' }} /></Link>
              </div>
            </div>
          </div>
          <div className="sidebar-menu">
            <ul className="menu">
              <li className="sidebar-title">Dealer Portal</li>
              {menuItems.map(item => (
                <li key={item.link} className={`sidebar-item ${location.pathname === item.link ? 'active' : ''}`}>
                  <Link to={item.link} className='sidebar-link'>
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li className="sidebar-item">
                <button onClick={() => { logout(); navigate('/login'); }} className='sidebar-link btn btn-link w-100 text-start border-0'>
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
          <h3 className="mb-0">Road Axe Dealer Dashboard</h3>
        </header>
        
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DealerLayout;
