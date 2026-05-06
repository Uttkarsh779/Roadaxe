import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ui/ProductCard';
import '../../styles/products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL ?? '';
        const res = await axios.get(`${API_URL}/api/public/products`);
        setProducts(res.data.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Re-trigger WOW.js animations for newly loaded DOM elements
  useEffect(() => {
    if (!loading && window.WOW) {
      new window.WOW().init();
    }
  }, [loading]);

  return (
    <>
      {/* Header Start */}
      <div className="container-fluid bg-breadcrumb">
        <div className="container text-center py-5" style={{ maxWidth: '900px' }}>
          <h4 className="text-white display-4 mb-4 wow fadeInDown" data-wow-delay="0.1s">Our Products</h4>
          <ol className="breadcrumb d-flex justify-content-center mb-0 wow fadeInDown" data-wow-delay="0.3s">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active text-primary">products</li>
          </ol>    
        </div>
      </div>
      {/* Header End */}

      <section className="section">
        <div className="container">
          <br /><br />
          
          {loading && (
            <div className="text-center py-5">
               <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-5">
              <h4>No products available at the moment.</h4>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="row g-3 g-lg-4">
              {products.map((product) => (
                <div className="col-6 col-lg-3" key={product._id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Products;
