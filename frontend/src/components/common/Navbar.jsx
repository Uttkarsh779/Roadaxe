import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { getImageUrl } from '../../utils/imageHelper';

const Navbar = () => {
  const { user, logout } = useAuth();

  useEffect(() => {
    // Sticky Navbar logic previously in mains.js
    const handleScroll = () => {
      if (window.scrollY > 45) {
        document.querySelector('.navbar')?.classList.add('sticky-top', 'shadow-sm');
      } else {
        document.querySelector('.navbar')?.classList.remove('sticky-top', 'shadow-sm');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Topbar Start */}
      <div className="container-fluid topbar bg-light px-5 d-none d-lg-block">
        <div className="row gx-0 align-items-center">
          <div className="col-lg-8 text-center text-lg-start mb-2 mb-lg-0">
            <div className="d-flex flex-wrap">
              <a href="https://maps.app.goo.gl/y11MoLUr9CnsE6Nu5" className="text-muted small me-4">
                <i className="fas fa-map-marker-alt text-primary me-2"></i>Our Location
              </a>
              <a href="tel:+919583553382" className="text-muted small me-4">
                <i className="fas fa-phone-alt text-primary me-2"></i>+91 9583553382
              </a>
              <a href="mailto:roadx@roadx.in" className="text-muted small me-0">
                <i className="fas fa-envelope text-primary me-2"></i>roadx@roadx.in
              </a>
            </div>
          </div>
          <div className="col-lg-4 text-center text-lg-end">
            <div className="d-inline-flex align-items-center" style={{ height: '45px' }}>
              {user ? (
                <>
                  <Link to="/"><small className="me-3 text-dark"><i className="fa fa-user text-primary me-2"></i>Welcome, {user.username}</small></Link>
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}><small className="me-3 text-dark"><i className="fa fa-sign-in-alt text-primary me-2"></i>Logout</small></a>
                </>
              ) : (
                <>
                  <Link to="/signup"><small className="me-3 text-dark"><i className="fa fa-user text-primary me-2"></i>Register</small></Link>
                  <Link to="/login"><small className="me-3 text-dark"><i className="fa fa-sign-in-alt text-primary me-2"></i>Login</small></Link>
                </>
              )}
              <div className="dropdown">
                <Link to="/" className="dropdown-toggle text-dark" data-bs-toggle="dropdown">
                  <small><i className="fa fa-home text-primary me-2"></i> Customer </small>
                </Link>
                <div className="dropdown-menu rounded">
                  <Link to="/" className="dropdown-item"><i className="fas fa-user-alt me-2"></i> Customer</Link>
                  <Link to="/dealership" className="dropdown-item"><i className="fas fa-store-alt me-2"></i> Dealership</Link>
                  {user && (
                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="dropdown-item">
                      <i className="fas fa-sign-out-alt me-2"></i> Log Out
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Topbar End */}

      {/* Navbar Start */}
      <div className="container-fluid position-relative p-0">
        <nav className="navbar navbar-expand-lg navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <div className="logo-container">
            <Link to="/" className="navbar-brand p-0">
              <img src={getImageUrl('/static/assets/main/Logo.webp')} className="logo" alt="Road Axe Motors Pvt Ltd" style={{ height: '100px' }} />
            </Link>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link to="/" className="nav-item nav-link">Home</Link>
              <Link to="/about" className="nav-item nav-link">About</Link>
              <Link to="/articles" className="nav-item nav-link">News & Articles</Link>
              <div className="nav-item dropdown">
                <Link to="/products" className="nav-link" data-bs-toggle="dropdown">
                  <span className="dropdown-toggle">Our Products</span>
                </Link>
                <div className="dropdown-menu m-0">
                  {/* Dynamic Categories will go here. Hardcoded a stub for now. */}
                  <Link to="/products" className="dropdown-item">View All Products</Link>
                </div>
              </div>
              <Link to="/dealership" className="nav-item nav-link">Join Dealership</Link>
              <Link to="/contact" className="nav-item nav-link">Contact Us</Link>
            </div>
            <a href="/static/assets/main/RoadX_Products_Broucher.pdf" download className="btn btn-primary rounded-pill py-2 px-4 my-3 my-lg-0 flex-shrink-0">
              Download Brochure
            </a>
          </div>
        </nav>
      </div>
      {/* Navbar End */}
    </>
  );
};

export default Navbar;
