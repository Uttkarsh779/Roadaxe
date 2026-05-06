import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/public/products?category=${categoryId}`);
        setProducts(res.data.data.products);
        // Assuming categoryId is the name or we find it
        setCategoryName(categoryId); 
        setLoading(false);
      } catch (err) {
        console.error("Error fetching category products:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryId, API_URL]);

  const getImageUrl = (img) => {
    if (!img) return '/static/assets/main/img/placeholder.webp';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  };

  return (
    <>
      <style>{`
        .product-card-10 { border: 1px solid #dee2e6; transition: 0.3s; }
        .product-card-10:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .product-media img { transition: 0.3s; }
        .product-card-10:hover .product-media img { transform: scale(1.05); }
        .product-card-info { text-align: center; padding: 15px; }
      `}</style>

      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader 
        title={categoryName} 
        breadcrumb={[
          { label: 'Products', link: '/products' },
          { label: categoryName, active: true }
        ]} 
      />

      <section className="section py-5">
        <div className="container">
          <div className="row g-3 g-lg-4">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            ) : products.length > 0 ? (
              products.map(product => (
                <div key={product._id} className="col-6 col-lg-3">
                  <div className="product-card-10 bg-white rounded overflow-hidden">
                    <div className="product-card-image">
                      <div className="product-media">
                        <Link to={`/product/${product._id}`}>
                          <img className="img-fluid" src={getImageUrl(product.image)} alt={product.name} />
                        </Link>
                      </div>
                    </div>
                    <div className="product-card-info">
                      <h5 style={{ color: '#008000' }}>{product.subcategory}</h5>
                      <h3 style={{ color: '#008000', fontSize: '1.2rem' }}>{product.name}</h3>
                      <h5>₹ {product.actual_price}</h5>
                      <Link to={`/product/${product._id}`} className="btn btn-success w-100" style={{ backgroundColor: '#008000', borderColor: '#008000' }}>
                        Book Now!
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5"><h3>No products found in this category.</h3></div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryProducts;
