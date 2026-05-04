import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageHelper';

const Footer = () => {
  return (
    <>
      {/* Footer Start */}
      <div className="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s">
        <div className="container py-5 border-start-0 border-end-0" style={{ border: '1px solid', borderColor: 'rgb(255, 255, 255, 0.08)' }}>
          <div className="row g-5">
            <div className="col-md-6 col-lg-6 col-xl-4">
              <div className="footer-item">
                <div className="glass-background">
                  <Link to="/" className="p-0">
                    <img src={getImageUrl('/static/assets/main/Logo.webp')} style={{ height: '100px' }} alt="Road Axe Motors Pvt Ltd" />
                  </Link>
                </div>
                <p className="mb-4 text-white">
                  Road Axe, India's electric 3-wheeler pioneer, powers the nation's sustainable revolution. With cutting-edge technology and a commitment to eco-friendly mobility, we lead the charge towards a greener future on three wheels.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-2">
              <div className="footer-item">
                <h4 className="text-white mb-4">Quick Links</h4>
                <Link to="/" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Home</Link>
                <Link to="/products" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Our Products</Link>
                <Link to="/about" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> About Us</Link>
                <Link to="/articles" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> News & Articles</Link>
                <Link to="/contact" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Contact Us</Link>
                <Link to="/dealershipenqy" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Dealership Program</Link>
                <Link to="/career" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Career</Link>
                <a href="/static/assets/main/RoadX_Products_Broucher.pdf" className="text-white" download><i className="fas fa-angle-right me-2 text-white"></i> Our Brochure</a>
                <a href="/static/sitemap.xml" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Sitemap</a>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4 text-white">Support</h4>
                <Link to="/privacy" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Privacy Policy</Link>
                <Link to="/terms" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Terms & Conditions</Link>
                <Link to="/contact" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> Support</Link>
                <Link to="/faq" className="text-white"><i className="fas fa-angle-right me-2 text-white"></i> FAQ</Link>
              </div>
            </div>
            <div className="col-md-6 col-lg-6 col-xl-3">
              <div className="footer-item">
                <h4 className="text-white mb-4">Contact Info</h4>
                <div className="d-flex align-items-center">
                  <i className="fas fa-map-marker-alt text-primary me-3"></i>
                  <p className="text-white mb-0">MIG-303, 4th Floor, Kalinga Vihar, Patrapada, Bhubaneswar, Pincode: 751019</p>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-envelope text-primary me-3"></i>
                  <p className="text-white mb-0">roadx@roadx.in</p>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fa fa-phone-alt text-primary me-3"></i>
                  <p className="text-white mb-0">+91 7978309060</p>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fa fa-phone-alt text-primary me-3"></i>
                  <p className="text-white mb-0">+91 9776442267</p>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fa fa-phone-alt text-primary me-3"></i>
                  <p className="text-white mb-0">+91 9583553382</p>
                </div>
                <br />
                <div className="d-flex">
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" target="_blank" rel="noreferrer" href="https://www.facebook.com/roadaxe?mibextid=ZbWKwL"><i className="fab fa-facebook-f text-white"></i></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" target="_blank" rel="noreferrer" href="https://pin.it/53h99IuT5"><i className="fab fa-pinterest text-white"></i></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-3" target="_blank" rel="noreferrer" href="https://www.instagram.com/road_axe?igsh=MTFkOGF6bWdmaW9tNA=="><i className="fab fa-instagram text-white"></i></a>
                  <a className="btn btn-primary btn-sm-square rounded-circle me-0" target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/road-axe/"><i className="fab fa-linkedin-in text-white"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}
      
      {/* Copyright Start */}
      <div className="container-fluid copyright py-4">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6 text-center text-md-start mb-md-0">
              <span className="text-body">
                <a href="https://roadx.in" className="border-bottom text-white"><i className="fas fa-copyright text-light me-2"></i>roadx.in</a>, All right reserved.
              </span>
            </div>
            <div className="col-md-6 text-center text-md-end text-body">
              Designed & Developed By <a className="border-bottom text-white" href="https://www.bigscoopstudio.com" target="_blank" rel="noreferrer">Big Scoop Studio</a>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}
    </>
  );
};

export default Footer;
