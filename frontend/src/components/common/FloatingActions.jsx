import { Link } from 'react-router-dom';

const FloatingActions = () => {
  return (
    <div className="floating-buttons">
      <Link to="/products" className="btn btn-primary">Learn More</Link>
      <a href="tel:+919583553382" className="btn btn-primary">Call Now</a>
      <a href="https://api.whatsapp.com/send?phone=9776442267&text=Hola!" className="btn btn-success" target="_blank" rel="noreferrer">
        <i className="fab fa-whatsapp"></i> WhatsApp
      </a>
    </div>
  );
};

export default FloatingActions;
