import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/public/articles`);
        setBlogs(res.data.data.articles);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  const getImageUrl = (img) => {
    if (!img) return '/static/assets/main/img/placeholder.webp';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  };

  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="News & Articles" breadcrumb={[{ label: 'Articles', active: true }]} />

      <div className="container-fluid service py-5">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h1 className="display-5 mb-4">Checkout Our Articles!</h1>
          </div>
          <div className="row g-4">
            {loading ? (
              <div className="text-center w-100"><div className="spinner-border text-primary"></div></div>
            ) : blogs.map(blog => (
              <div key={blog._id} className="col-md-6 col-lg-4 wow fadeInUp" data-wow-delay="0.2s">
                <div className="service-item bg-white shadow-sm rounded overflow-hidden h-100">
                  <div className="service-img">
                    <img src={getImageUrl(blog.thumbnail_image)} className="img-fluid w-100" style={{ height: '250px', objectFit: 'cover' }} alt={blog.title} />
                  </div>
                  <div className="p-4">
                    <Link to={`/blog/${blog._id}`} className="h4 d-inline-block mb-3 text-dark text-decoration-none">
                      {blog.title}
                    </Link>
                    <p className="mb-4 text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {blog.description}
                    </p>
                    <Link className="btn btn-primary rounded-pill py-2 px-4" to={`/blog/${blog._id}`}>Read Now!</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;
