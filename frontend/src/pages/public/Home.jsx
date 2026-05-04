import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';
import '../../styles/logo-slider.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [videos, setVideos] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  // Refs for carousels
  const heroRef = useRef(null);
  const productRef = useRef(null);
  const blogRef = useRef(null);
  const testimonialRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Fetch Data
    const fetchData = async () => {
      try {
        const [prodRes, artRes, teamRes, testRes] = await Promise.all([
          axios.get(`${API_URL}/api/public/products`),
          axios.get(`${API_URL}/api/public/articles`),
          axios.get(`${API_URL}/api/public/team`),
          axios.get(`${API_URL}/api/public/testimonials`)
        ]);

        setProducts(prodRes.data.data.products);
        setArticles(artRes.data.data.articles);
        setTeam(teamRes.data.data.team);
        setTestimonials(testRes.data.data.testimonials);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // YouTube fetch
    const fetchVideos = async () => {
      const channelId = 'UCSM8J3Bt5SzLMM76-BdR05A';
      const apiKey = 'AIzaSyAdWreovoia1L0H7koRCtOQnYUawWb6e_g';
      const maxResults = 6;
      try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`);
        const data = await res.json();
        setVideos(data.items || []);
      } catch (err) {
        console.error("Error fetching youtube videos:", err);
      }
    };
    fetchVideos();
  }, []);

  // Initialize Static Carousel (Hero)
  useEffect(() => {
    if (window.$ && heroRef.current && !window.$(heroRef.current).hasClass('owl-loaded')) {
      window.$(heroRef.current).owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 500,
        dots: true,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
      });
    }
  }, []);

  // Initialize Dynamic Carousels
  useEffect(() => {
    if (products.length > 0 && window.$ && productRef.current && !window.$(productRef.current).hasClass('owl-loaded')) {
      window.$(productRef.current).owlCarousel({
        autoplay: true,
        smartSpeed: 4500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: { 0:{items:1}, 576:{items:1}, 768:{items:2}, 992:{items:2}, 1200:{items:3} }
      });
    }
  }, [products]);

  useEffect(() => {
    if (articles.length > 0 && window.$ && blogRef.current && !window.$(blogRef.current).hasClass('owl-loaded')) {
      window.$(blogRef.current).owlCarousel({
        autoplay: true,
        smartSpeed: 4500,
        center: false,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: { 0:{items:1}, 576:{items:1}, 768:{items:2}, 992:{items:2}, 1200:{items:3} }
      });
    }
  }, [articles]);

  useEffect(() => {
    if (testimonials.length > 0 && window.$ && testimonialRef.current && !window.$(testimonialRef.current).hasClass('owl-loaded')) {
      window.$(testimonialRef.current).owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: { 0:{items:1}, 576:{items:1}, 768:{items:2}, 992:{items:2}, 1200:{items:3} }
      });
    }
  }, [testimonials]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/forms/enquiry`, formData);
      setFormStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ name: '', email: '', phone_number: '', subject: '', message: '' });
    } catch (err) {
      setFormStatus({ type: 'error', message: 'Failed to send message. Try again.' });
    }
  };

  return (
    <>
      {/* Carousel Start */}
      <div className="header-carousel owl-carousel" ref={heroRef}>
        <div className="header-carousel-item">
          <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920838/roadx/static/main/img/4.webp" className="img-fluid w-100" alt="E-Rickshaw Odisha - Nandighosh Road Axe" />
          <div className="carousel-caption">
            <div className="container">
              <div className="row g-5">
                <div className="col-12 animated fadeInUp">
                  <div className="text-center">
                    <h4 className="text-primary text-uppercase fw-bold mb-4">Road Axe – The Future of Sustainable Mobility in India</h4>
                    <h1 className="display-4 text-uppercase text-white mb-4">Leading Electric Mobility in India</h1>
                    <p className="mb-5 fs-5">India's Premier Manufacturer of Electric Vehicles</p>
                    <div className="d-flex justify-content-center flex-shrink-0 mb-4">
                      <a className="btn btn-light rounded-pill py-3 px-4 px-md-5 me-2" href="/static/assets/main/RoadX_Products_Broucher.pdf" download>
                        <i className="fas fa-download me-2"></i>Download Brochure
                      </a>
                      <a className="btn btn-primary rounded-pill py-3 px-4 px-md-5 ms-2" href="#contactid">Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-carousel-item">
          <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920835/roadx/static/main/img/1.webp" className="img-fluid w-100" alt="Electric Food Truck Manufacturer in Odisha" />
          <div className="carousel-caption">
            <div className="container">
              <div className="row g-5">
                <div className="col-12 animated fadeInUp">
                  <div className="text-center">
                    <h4 className="text-primary text-uppercase fw-bold mb-4">Road Axe – The Future of Sustainable Mobility in India</h4>
                    <h2 className="display-4 text-uppercase text-white mb-4">Leading Electric Mobility in India</h2>
                    <p className="mb-5 fs-5">India's Premier Manufacturer of Electric Vehicles</p>
                    <div className="d-flex justify-content-center flex-shrink-0 mb-4">
                      <a className="btn btn-light rounded-pill py-3 px-4 px-md-5 me-2" href="/static/assets/main/RoadX_Products_Broucher.pdf" download>
                        <i className="fas fa-download me-2"></i>Download Brochure
                      </a>
                      <a className="btn btn-primary rounded-pill py-3 px-4 px-md-5 ms-2" href="#contactid">Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="header-carousel-item">
          <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920836/roadx/static/main/img/2.webp" className="img-fluid w-100" alt="E-Delivery Van Supplier in Odisha" />
          <div className="carousel-caption">
            <div className="container">
              <div className="row g-5">
                <div className="col-12 animated fadeInUp">
                  <div className="text-center">
                    <h4 className="text-primary text-uppercase fw-bold mb-4">Road Axe – The Future of Sustainable Mobility in India</h4>
                    <h2 className="display-4 text-uppercase text-white mb-4">Leading Electric Mobility in India</h2>
                    <p className="mb-5 fs-5">India's Premier Manufacturer of Electric Vehicles</p>
                    <div className="d-flex justify-content-center flex-shrink-0 mb-4">
                      <a className="btn btn-light rounded-pill py-3 px-4 px-md-5 me-2" href="/static/assets/main/RoadX_Products_Broucher.pdf" download>
                        <i className="fas fa-download me-2"></i>Download Brochure
                      </a>
                      <a className="btn btn-primary rounded-pill py-3 px-4 px-md-5 ms-2" href="#contactid">Contact Us</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Carousel End */}

      {/* About Start */}
      <div className="container-fluid about py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-xl-7 wow fadeInLeft" data-wow-delay="0.2s">
              <div>
                <h4 className="text-primary">About Us</h4>
                <h2 className="display-5 mb-4">Road Axe: Pioneering Electric Mobility in India</h2>
                <p className="mb-4">At Road Axe, we are dedicated to leading the charge in sustainable transport. As Odisha’s top manufacturer of E-Rickshaws, Golf Carts, and electric utility vehicles, we offer eco-friendly solutions tailored to the diverse needs of Indian cities and industries. From delivery vans to garbage collection vehicles, our product range combines affordability, durability, and cutting-edge technology.</p>
                <div className="row g-4">
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="d-flex">
                      <div><i className="fas fa-bullseye fa-3x text-primary"></i></div>
                      <div className="ms-4">
                        <h4>Mission</h4>
                        <p>To Accelerate India's Transition to Clean, Efficient, and Accessible Transportation</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-6 col-xl-6">
                    <div className="d-flex">
                      <div><i className="fas fa-eye fa-3x text-primary"></i></div>
                      <div className="ms-4">
                        <h4>Vision</h4>
                        <p>A Cleaner, Greener India Powered by Electric Mobility</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex">
                      <a className="btn btn-primary btn-sm-square rounded-circle me-3" style={{ height: '50px', width: '50px' }} target="_blank" rel="noreferrer" href="https://www.facebook.com/roadaxe?mibextid=ZbWKwL"><i className="fab fa-facebook-f text-white"></i></a>
                      <a className="btn btn-primary btn-sm-square rounded-circle me-3" style={{ height: '50px', width: '50px' }} target="_blank" rel="noreferrer" href="https://www.youtube.com/@roadaxe"><i className="fab fa-youtube text-white"></i></a>
                      <a className="btn btn-primary btn-sm-square rounded-circle me-3" style={{ height: '50px', width: '50px' }} target="_blank" rel="noreferrer" href="https://www.instagram.com/road_axe?igsh=MTFkOGF6bWdmaW9tNA=="><i className="fab fa-instagram text-white"></i></a>
                      <a className="btn btn-primary btn-sm-square rounded-circle me-0" style={{ height: '50px', width: '50px' }} target="_blank" rel="noreferrer" href="https://www.linkedin.com/company/road-axe/"><i className="fab fa-linkedin-in text-white"></i></a>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex">
                      <i className="fas fa-phone-alt fa-2x text-primary me-4"></i>
                      <div>
                        <h4>Call Us</h4>
                        <p className="mb-0 fs-5" style={{ letterSpacing: '1px' }}>+91 9403890774</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 wow fadeInRight" data-wow-delay="0.2s">
              <div className="bg-primary rounded position-relative overflow-hidden">
                <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920841/roadx/static/main/img/aboutfinal.webp" className="img-fluid rounded w-100" alt="Eco-friendly Electric Garbage Van" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Products Start */}
      <div className="container-fluid blog py-5">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">Innovative Electric Vehicles Tailored for Every Purpose</h4>
            <h2 className="display-5 mb-4">Our Products!</h2>
            <p className="mb-0">At Road Axe, we specialize in a diverse range of electric vehicles designed to meet India’s unique transportation and utility needs. From E-Rickshaws and Golf Carts to E-Food Trucks, E-Delivery Vans, and E-Garbage Vans, each product is crafted with precision, efficiency, and sustainability at its core.</p>
          </div>
          {products.length > 0 && (
            <div className="owl-carousel blog-carousel wow fadeInUp" data-wow-delay="0.2s" ref={productRef}>
              {products.map((i, index) => (
                <div className="blog-item p-4" key={index}>
                  <div className="blog-img mb-4">
                    <img src={getImageUrl(i.image)} className="img-fluid w-100 rounded" alt={i.name} onError={handleImageError} />
                    <div className="blog-title">
                      <Link to={`/product/${i._id}`} className="btn">{i.category}</Link>
                    </div>
                  </div>
                  <Link to={`/product/${i._id}`} className="h4 d-inline-block mb-3" title={i.name}>
                    <span className="truncate-title">{i.name}</span>
                  </Link>
                  <Link to={`/product/${i._id}`} className="btn btn-success" style={{ width: '100%', backgroundColor: '#008000', borderColor: '#008000' }}>Book Now!</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Product End */}

      {/* Offer Start */}
      <div className="container-fluid offer-section pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">Why Road Axe?</h4>
            <h2 className="display-5 mb-4">Why Choose Road Axe?</h2>
            <p className="mb-0">Reliable, Sustainable, and Cost-Effective Electric Mobility Solutions</p>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-xl-5 wow fadeInLeft" data-wow-delay="0.2s">
              <div className="nav nav-pills bg-light rounded p-5">
                <a className="accordion-link p-4 active mb-4" data-bs-toggle="pill" href="#collapseOne">
                  <h5 className="mb-0">Unmatched Quality</h5>
                </a>
                <a className="accordion-link p-4 mb-4" data-bs-toggle="pill" href="#collapseTwo">
                  <h5 className="mb-0">Affordable and Cost-Effective</h5>
                </a>
                <a className="accordion-link p-4 mb-4" data-bs-toggle="pill" href="#collapseThree">
                  <h5 className="mb-0">Eco-Friendly and Sustainable</h5>
                </a>
                <a className="accordion-link p-4 mb-0" data-bs-toggle="pill" href="#collapseFour">
                  <h5 className="mb-0">Customer-Centric Service</h5>
                </a>
              </div>
            </div>
            <div className="col-xl-7 wow fadeInRight" data-wow-delay="0.4s">
              <div className="tab-content">
                <div id="collapseOne" className="tab-pane fade show p-0 active">
                  <div className="row g-4">
                    <div className="col-md-7">
                      <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920849/roadx/static/main/img/Eco1.webp" className="img-fluid w-100 rounded" alt="Top Electric Vehicle Manufacturer" />
                    </div>
                    <div className="col-md-5">
                      <h2 className="display-5 mb-4">Unmatched Quality</h2>
                      <p className="mb-4">Our vehicles are built with top-grade materials and components, ensuring durability, performance, and minimal maintenance.</p>
                    </div>
                  </div>
                </div>
                <div id="collapseTwo" className="tab-pane fade show p-0">
                  <div className="row g-4">
                    <div className="col-md-7">
                      <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920850/roadx/static/main/img/Eco2.webp" className="img-fluid w-100 rounded" alt="Affordable E-Loaders" />
                    </div>
                    <div className="col-md-5">
                      <h2 className="display-5 mb-4">Affordable and Cost-Effective</h2>
                      <p className="mb-4">Road Axe offers competitive pricing and low operational costs, making electric mobility accessible for businesses of all sizes.</p>
                    </div>
                  </div>
                </div>
                <div id="collapseThree" className="tab-pane fade show p-0">
                  <div className="row g-4">
                    <div className="col-md-7">
                      <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920851/roadx/static/main/img/Eco3.webp" className="img-fluid w-100 rounded" alt="Eco Friendly" />
                    </div>
                    <div className="col-md-5">
                      <h2 className="display-5 mb-4">Eco-Friendly and Sustainable</h2>
                      <p className="mb-4">Committed to a cleaner future, our zero-emission electric vehicles contribute to reduced air pollution and a greener India.</p>
                    </div>
                  </div>
                </div>
                <div id="collapseFour" className="tab-pane fade show p-0">
                  <div className="row g-4">
                    <div className="col-md-7">
                      <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920853/roadx/static/main/img/Eco4.webp" className="img-fluid w-100 rounded" alt="Customer Service" />
                    </div>
                    <div className="col-md-5">
                      <h2 className="display-5 mb-4">Customer-Centric Service</h2>
                      <p className="mb-4">We provide comprehensive support from purchase to after-sales service, ensuring a seamless experience and reliable partnership.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Offer End */}

      {/* Blog Start */}
      <div className="container-fluid blog py-5">
        <div className="container py-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">News & Article</h4>
            <h2 className="display-5 mb-4">Checkout Our Latest Articles!</h2>
          </div>
          {articles.length > 0 && (
            <div className="owl-carousel blog-carousel wow fadeInUp" data-wow-delay="0.2s" ref={blogRef}>
              {articles.map((i, index) => (
                <div className="blog-item p-4" key={index}>
                  <div className="blog-img mb-4">
                    <img src={getImageUrl(i.thumbnail_image)} className="img-fluid w-100 rounded" alt={i.title} onError={handleImageError} />
                    <div className="blog-title">
                      <Link to={`/content/${i._id}`} className="btn">Latest Newz</Link>
                    </div>
                  </div>
                  <Link to={`/content/${i._id}`} className="h4 d-inline-block mb-3" title={i.title}>
                    <span className="truncate-title">{i.title}</span>
                  </Link>
                  <p className="mb-4" title={i.description}><span className="truncate-description">{i.description}</span></p>
                  <Link className="btn btn-primary rounded-pill py-2 px-4" to={`/content/${i._id}`}>Read Now!</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Blog End */}

      {/* FAQs Start */}
      <div className="container-fluid faq-section py-5">
        <div className="container py-5 overflow-hidden">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">FAQs</h4>
            <h2 className="display-5 mb-4">Frequently Asked Questions</h2>
            <p className="mb-0">Have questions? We’ve got you covered! Explore our FAQs for quick answers.</p>
          </div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.2s">
              <div className="accordion accordion-flush bg-light rounded p-5" id="accordionFlushSection">
                <div className="accordion-item rounded-top">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button collapsed rounded-top" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne">
                      What types of electric vehicles does Road Axe manufacture?
                    </button>
                  </h2>
                  <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushSection">
                    <div className="accordion-body">
                      Road Axe specializes in manufacturing electric 3-wheelers and golf carts, catering to sectors such as food delivery, cargo transport, and passenger services.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo">
                      How do Road Axe vehicles support various sectors?
                    </button>
                  </h2>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushSection">
                    <div className="accordion-body">
                      Road Axe provides electric vehicle solutions tailored for the food industry, cargo delivery, and passenger transport, ensuring efficient, eco-friendly operations.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree">
                      What are the environmental benefits of Road Axe electric vehicles?
                    </button>
                  </h2>
                  <div id="flush-collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFlushSection">
                    <div className="accordion-body">
                      Road Axe EVs are powered by electricity, reducing carbon emissions and helping promote a cleaner, greener environment.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
              <div className="bg-primary rounded">
                <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920854/roadx/static/main/img/FAQ.webp" className="img-fluid w-100" alt="Frequently Asked Questions about Road Axe" style={{ backgroundColor: 'transparent' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* FAQs End */}

      {/* Team Start */}
      <div className="container-fluid team pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">Our Team</h4>
            <h2 className="display-5 mb-4">Meet Our Talented Team</h2>
            <p className="mb-0">Our diverse team combines expertise and creativity, dedicated to delivering exceptional results.</p>
          </div>
          <div className="row g-4">
            {team.map((i, index) => (
              <div className="col-md-6 col-lg-6 col-xl-3 wow fadeInUp" data-wow-delay="0.2s" key={index}>
                <div className="team-item">
                  <div className="team-img">
                    <img src={getImageUrl(i.image)} className="img-fluid" alt="Team Member" onError={handleImageError} />
                  </div>
                  <div className="team-title">
                    <h4 className="mb-0">{i.name}</h4>
                    <p className="mb-0">{i.designation}</p>
                  </div>
                  <div className="team-icon">
                    <a className="btn btn-primary btn-sm-square rounded-circle me-3" href={i.facebook_link}><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-primary btn-sm-square rounded-circle me-3" href={i.x_link}><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-primary btn-sm-square rounded-circle me-3" href={i.linkedin_link}><i className="fab fa-linkedin-in"></i></a>
                    <a className="btn btn-primary btn-sm-square rounded-circle me-0" href={i.instagram_link}><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Team End */}

      {/* Clients Start */}
      <section className="py-5 bg-white border-top border-bottom border-light">
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-7 col-xxl-6">
              <h2 className="fs-6 text-secondary mb-2 text-uppercase text-center">Our Clients</h2>
              <h2 className="mb-4 display-5 text-center">Trusted by over 786+ clients.</h2>
              <p className="fs-5 text-secondary mb-5 text-center">Our clients are our top priority, and we are committed to providing them with the highest level of service.</p>
              <hr className="w-50 mx-auto mb-5 mb-xl-9 border-dark-subtle" />
            </div>
          </div>
        </div>
        <div className="logo-slider mt-4">
          <div className="logo-slide-track">
            {/* First set of logos */}
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map(num => (
              <div className="logo-slide" key={`logo1-${num}`}>
                <img src={getImageUrl(`/static/assets/main/img/logos/${num}.webp`)} alt={`Client ${num}`} onError={handleImageError} />
              </div>
            ))}
            {/* Duplicate set of logos for infinite loop */}
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21].map(num => (
              <div className="logo-slide" key={`logo2-${num}`}>
                <img src={getImageUrl(`/static/assets/main/img/logos/${num}.webp`)} alt={`Client ${num}`} onError={handleImageError} />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Clients End */}

      {/* Youtube Channel */}
      <div className="container">
        <h2 className="mb-4 display-5 text-center">Our Content</h2>
        <div className="row" id="video-container">
          {videos.map((item, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="embed-responsive embed-responsive-16by9">
                <iframe className="embed-responsive-item w-100" style={{ minHeight: '200px' }} src={`https://www.youtube.com/embed/${item.id.videoId}`} allowFullScreen></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Youtube Channel End */}

      {/* Testimonial Start */}
      <div className="container-fluid testimonial pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">Testimonial</h4>
            <h2 className="display-5 mb-4">Our Clients Reviews</h2>
            <p className="mb-0">Hear directly from our satisfied clients about their experiences with Road Axe Motors.</p>
          </div>
          {testimonials.length > 0 && (
            <div className="owl-carousel testimonial-carousel wow fadeInUp" data-wow-delay="0.2s" ref={testimonialRef}>
              {testimonials.map((i, index) => (
                <div className="testimonial-item" key={index}>
                  <div className="testimonial-quote-left">
                    <i className="fas fa-quote-left fa-2x"></i>
                  </div>
                  <div className="testimonial-img">
                    <img src={getImageUrl(i.image)} className="img-fluid" alt="Reviewer" onError={handleImageError} />
                  </div>
                  <div className="testimonial-text">
                    <p className="mb-0">{i.review}</p>
                  </div>
                  <div className="testimonial-title">
                    <div>
                      <h4 className="mb-0">{i.name}</h4>
                      <p className="mb-0">{i.designation}</p>
                    </div>
                    <div className="d-flex text-primary">
                      <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
                    </div>
                  </div>
                  <div className="testimonial-quote-right">
                    <i className="fas fa-quote-right fa-2x"></i>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Testimonial End */}

      {/* Contact Start */}
      <div className="container-fluid contact py-5" id="contactid">
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-xl-6">
              <div className="wow fadeInUp" data-wow-delay="0.2s">
                <div className="bg-light rounded p-5 mb-5">
                  <h4 className="text-primary mb-4">Customer Support</h4>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="contact-add-item">
                        <div className="contact-icon text-primary mb-4">
                          <i className="fas fa-map-marker-alt fa-2x"></i>
                        </div>
                        <div>
                          <h4>Address</h4>
                          <p className="mb-0">MIG-303, 4th Floor, Kalinga Vihar, Patrapada</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-add-item">
                        <div className="contact-icon text-primary mb-4">
                          <i className="fas fa-envelope fa-2x"></i>
                        </div>
                        <div>
                          <h4>Mail Us</h4>
                          <p className="mb-0">roadx@roadx.in</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="contact-add-item">
                        <div className="contact-icon text-primary mb-4">
                          <i className="fa fa-phone-alt fa-2x"></i>
                        </div>
                        <div>
                          <h4>Customer Support</h4>
                          <p className="mb-0">+91 9583553382</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-light p-5 rounded h-100 wow fadeInUp" data-wow-delay="0.2s">
                  <h4 className="text-primary">Send Your Message</h4>
                  {formStatus && (
                    <div className={`alert ${formStatus.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                      {formStatus.message}
                    </div>
                  )}
                  <form onSubmit={handleFormSubmit}>
                    <div className="row g-4">
                      <div className="col-lg-12 col-xl-6">
                        <div className="form-floating">
                          <input type="text" className="form-control border-0" id="name" placeholder="Your Name" name="name" value={formData.name} onChange={handleFormChange} required />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6">
                        <div className="form-floating">
                          <input type="email" className="form-control border-0" id="email" placeholder="Your Email" name="email" value={formData.email} onChange={handleFormChange} required />
                          <label htmlFor="email">Your Email</label>
                        </div>
                      </div>
                      <div className="col-lg-12 col-xl-6">
                        <div className="form-floating">
                          <input type="tel" className="form-control border-0" id="phone" placeholder="Phone" name="phone_number" value={formData.phone_number} onChange={handleFormChange} required />
                          <label htmlFor="phone">Your Phone</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input type="text" className="form-control border-0" id="subject" placeholder="Subject" name="subject" value={formData.subject} onChange={handleFormChange} required />
                          <label htmlFor="subject">Subject</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <textarea className="form-control border-0" placeholder="Leave a message here" id="message" style={{ height: '160px' }} name="message" value={formData.message} onChange={handleFormChange} required></textarea>
                          <label htmlFor="message">Message</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit">Send Message</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-xl-6 wow fadeInRight" data-wow-delay="0.2s">
              <div className="rounded h-100">
                <iframe className="rounded h-100 w-100" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2958.7197649286313!2d85.75925607398486!3d20.238616114450046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a9a705b40f3d%3A0x53a2a838814df4c9!2sROADX%20-%20Electric%20Auto%20Rickshaw%20-%20Golf%20Cart%20%26%20Buggy%20-%20Electric%20Bus%20Manufacturer!5e1!3m2!1sen!2sin!4v1727704307499!5m2!1sen!2sin" style={{ height: '400px' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}
    </>
  );
};

export default Home;
