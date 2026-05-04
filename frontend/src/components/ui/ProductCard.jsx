import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const ProductCard = ({ product }) => {



  return (
    <div className="product-card-10">
      <div className="product-card-image">
        <div className="product-media">
          <Link to={`/product/${product._id}`}>
            <img className="img-fluid" src={getImageUrl(product.image)} title={product.name} alt={product.name} onError={handleImageError} />
          </Link>
        </div>
      </div>
      <div className="product-card-info">
        <h5 style={{ color: '#008000' }}>{product.subcategory}</h5>
        <h3 style={{ color: '#008000' }}>{product.name}</h3>
        <h5>₹ {product.actual_price}</h5>
        <Link 
          to={`/product/${product._id}`} 
          className="btn btn-success" 
          style={{ width: '100%', backgroundColor: '#008000', borderColor: '#008000' }}
        >
          Book Now!
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
