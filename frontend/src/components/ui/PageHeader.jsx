import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, breadcrumb = [] }) => {
  return (
    <div className="container-fluid bg-breadcrumb">
      <div className="container text-center py-5" style={{ maxWidth: '900px' }}>
        <h4 className="text-white display-4 mb-4 wow fadeInDown" data-wow-delay="0.1s">{title}</h4>
        <ol className="breadcrumb d-flex justify-content-center mb-0 wow fadeInDown" data-wow-delay="0.3s">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          {breadcrumb.map((item, index) => (
            <li key={index} className={`breadcrumb-item ${item.active ? 'active text-primary' : ''}`}>
              {item.active ? item.label : <Link to={item.link}>{item.label}</Link>}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PageHeader;
