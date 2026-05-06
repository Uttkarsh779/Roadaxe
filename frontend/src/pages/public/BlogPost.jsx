import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const BlogPost = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articleRes, allRes] = await Promise.all([
          axios.get(`${API_URL}/api/public/articles/${id}`),
          axios.get(`${API_URL}/api/public/articles`)
        ]);
        setArticle(articleRes.data.data.article);
        setLatestBlogs(allRes.data.data.articles.filter(b => b._id !== id).slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id, API_URL]);



  if (loading) return <div className="container py-5 text-center" style={{ marginTop: '100px' }}><div className="spinner-border text-primary"></div></div>;
  if (!article) return <div className="container py-5 text-center" style={{ marginTop: '100px' }}><h2>Article not found</h2></div>;

  return (
    <>
      <div className="container-fluid" style={{ height: '90px', backgroundColor: '#00d084' }}></div>
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 col-md-7">
            <div className="row">
              <div className="col-12 mb-4">
                <img src={getImageUrl(article.banner_image)} className="img-fluid banner-img rounded shadow-sm" alt={article.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} onError={handleImageError} />
              </div>
              <div className="col-12">
                <div className="blog-content">
                  <h1 className="mb-4 fw-bold">{article.title}</h1>
                  <div 
                    className="blog-body lead text-muted" 
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="col-lg-4 col-md-5">
            <div className="latest-content bg-light p-4 rounded shadow-sm">
              <h3 className="mb-4">Latest News</h3>
              {latestBlogs.map(blog => (
                <div key={blog._id} className="latest-post mb-4 border-bottom pb-3">
                  <Link to={`/blog/${blog._id}`} className="text-decoration-none text-dark">
                    <div className="row g-2 align-items-center">
                      <div className="col-4">
                        <img src={getImageUrl(blog.thumbnail_image)} className="img-fluid rounded" alt={blog.title} style={{ height: '80px', objectFit: 'cover', width: '100%' }} onError={handleImageError} />
                      </div>
                      <div className="col-8">
                        <h6 className="latest-title mb-0">{blog.title}</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
