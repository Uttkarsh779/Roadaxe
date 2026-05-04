import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/public/products/${id}`);
        setProduct(res.data.data.product);
        setSimilarProducts(res.data.data.similarProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found or server error.");
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, API_URL]);

  const handleQuantityChange = (delta) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handleBookNow = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}`, quantity } });
    } else {
      navigate('/checkout', { state: { product, quantity } });
    }
  };

  const getImageUrl = (img) => {
    if (!img) return '/static/assets/main/img/placeholder.webp';
    if (img.startsWith('http') || img.startsWith('data:')) return img;
    const path = img.startsWith('/') ? img : `/${img}`;
    return `${API_URL}${path}`;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
        <h2 className="text-danger">{error || "Product not found"}</h2>
        <Link to="/products" className="btn btn-primary mt-3">Back to Products</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .icon-hover:hover {
          border-color: #3b71ca !important;
          background-color: white !important;
          color: #3b71ca !important;
        }
        .icon-hover:hover i {
          color: #3b71ca !important;
        }
        .fit {
          object-fit: contain;
        }
        .img-md {
          width: 96px;
          height: 96px;
        }
      `}</style>

      {/* Header Spacer */}
      <div className="container-fluid" style={{ height: '90px' }}></div>

      {/* Content */}
      <section className="py-5">
        <div className="container">
          <div className="row gx-5">
            <aside className="col-lg-6">
              <div className="border rounded-4 mb-3 d-flex justify-content-center bg-white">
                <a className="rounded-4" target="_blank" rel="noreferrer" href={getImageUrl(product.image)}>
                  <img 
                    style={{ maxWidth: '100%', maxHeight: '100vh', margin: 'auto' }} 
                    className="rounded-4 fit" 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                  />
                </a>
              </div>
            </aside>
            <main className="col-lg-6">
              <div className="ps-lg-3">
                <h4 className="title text-dark">
                  {product.name}
                </h4>
                <div className="d-flex flex-row my-3">
                  <div className="text-warning mb-1 me-2">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                    <span className="ms-1">4.5</span>
                  </div>
                  <span className="text-muted">
                    <i className="fas fa-shopping-basket fa-sm mx-1"></i>
                    10K+ orders delivered
                  </span>
                </div>

                <div className="mb-3">
                  <span className="h5">₹ {product.actual_price}</span>
                  <span className="text-muted">/Per Unit</span>
                </div>

                <p>{product.meta_description}</p>

                <table className="table table-bordered">
                  <tbody style={{ border: 'transparent' }}>
                    <tr>
                      <td>
                        {product.highlight_1_icon && (
                          <img src={getImageUrl(product.highlight_1_icon)} alt={product.highlight_1} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_1}
                      </td>
                      <td>
                        {product.highlight_2_icon && (
                          <img src={getImageUrl(product.highlight_2_icon)} alt={product.highlight_2} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_2}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {product.highlight_3_icon && (
                          <img src={getImageUrl(product.highlight_3_icon)} alt={product.highlight_3} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_3}
                      </td>
                      <td>
                        {product.highlight_4_icon && (
                          <img src={getImageUrl(product.highlight_4_icon)} alt={product.highlight_4} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_4}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        {product.highlight_5_icon && (
                          <img src={getImageUrl(product.highlight_5_icon)} alt={product.highlight_5} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_5}
                      </td>
                      <td>
                        {product.highlight_6_icon && (
                          <img src={getImageUrl(product.highlight_6_icon)} alt={product.highlight_6} style={{ height: '25px', borderRadius: '50%', marginRight: '8px' }} />
                        )}
                        {product.highlight_6}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr />
                <form onSubmit={handleBookNow}>
                  <div className="d-flex align-items-center mb-4">
                    <div className="input-group" style={{ width: '150px' }}>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => handleQuantityChange(-1)}>-</button>
                      <input 
                        type="number" 
                        className="form-control text-center" 
                        value={quantity} 
                        readOnly 
                      />
                      <button type="button" className="btn btn-outline-secondary" onClick={() => handleQuantityChange(1)}>+</button>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-3">
                    <i className="me-1 fa fa-shopping-basket"></i>
                    Book Now for ₹ {product.booking_price || '5000'}
                  </button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </section>

      <section className="bg-light border-top py-4">
        <div className="container">
          <div className="row gx-4">
            <div className="col-lg-8 mb-4">
              <div className="border rounded-2 px-3 py-2 bg-white shadow-sm">
                <div className="tab-content">
                  <div className="tab-pane fade show active">
                    <p className="mt-2">{product.description}</p>
                    <table className="table border mt-3 mb-2">
                      <tbody>
                        {[1,2,3,4,5,6,7,8,9,10].map(i => {
                          const spec = product[`spec${i}`];
                          const ans = product[`spec${i}ans`];
                          if (!spec || spec.trim() === '') return null;
                          return (
                            <tr key={i}>
                              <th className="py-2" style={{ color: 'black', width: '40%' }}>{spec}:</th>
                              <td className="py-2">{ans}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <aside className="col-lg-4">
              <div className="border rounded-2 bg-white shadow-sm">
                <div className="card-body p-3">
                  <h5 className="card-title mb-3">Similar items</h5>
                  {similarProducts.length > 0 ? similarProducts.map((item) => (
                    <div key={item._id} className="d-flex mb-3 align-items-center">
                      <Link to={`/product/${item._id}`} className="me-3">
                        <img 
                          src={getImageUrl(item.image)} 
                          style={{ minWidth: '96px', height: '96px' }} 
                          className="img-md img-thumbnail" 
                          alt={item.name}
                        />
                      </Link>
                      <div className="info">
                        <Link to={`/product/${item._id}`} className="nav-link p-0 mb-1 text-primary">
                          {item.name}
                        </Link>
                        <strong className="text-dark">₹ {item.actual_price}</strong>
                      </div>
                    </div>
                  )) : (
                    <p className="text-muted">No similar items found.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
