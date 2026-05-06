import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PageHeader from '../../components/ui/PageHeader';
import { getImageUrl, handleImageError } from '../../utils/imageHelper';

const About = () => {
  const [team, setTeam] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    axios.get(`${API_URL}/api/public/team`).then(res => setTeam(res.data.data.team));
    window.scrollTo(0, 0);
  }, [API_URL]);



  return (
    <>
      <div className="container-fluid" style={{ height: '90px' }}></div>
      <PageHeader title="About Us" breadcrumb={[{ label: 'About', active: true }]} />

      {/* About Section */}
      <div className="container-fluid about py-5">
        <div className="container py-5">
          <div className="row g-5 align-items-center">
            <div className="col-xl-7 wow fadeInLeft" data-wow-delay="0.2s">
              <div>
                <h4 className="text-primary">About Us</h4>
                <h2 className="display-5 mb-4">Road Axe: Pioneering Electric Mobility in India</h2>
                <p className="mb-4">At Road Axe, we are dedicated to leading the charge in sustainable transport. As Odisha’s top manufacturer of E-Rickshaws, Golf Carts, and electric utility vehicles, we offer eco-friendly solutions tailored to the diverse needs of Indian cities and industries.</p>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex">
                      <i className="fas fa-bullseye fa-3x text-primary"></i>
                      <div className="ms-4">
                        <h4>Mission</h4>
                        <p>To Accelerate India's Transition to Clean, Efficient, and Accessible Transportation</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex">
                      <i className="fas fa-eye fa-3x text-primary"></i>
                      <div className="ms-4">
                        <h4>Vision</h4>
                        <p>A Cleaner, Greener India Powered by Electric Mobility</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-5 wow fadeInRight" data-wow-delay="0.2s">
              <div className="bg-primary rounded position-relative overflow-hidden">
                <img src="https://res.cloudinary.com/dvcjqpq4d/image/upload/v1777920841/roadx/static/main/img/aboutfinal.webp" className="img-fluid rounded w-100" alt="About Road Axe" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="container-fluid team pb-5">
        <div className="container pb-5">
          <div className="text-center mx-auto pb-5 wow fadeInUp" data-wow-delay="0.2s" style={{ maxWidth: '800px' }}>
            <h4 className="text-primary">Our Team</h4>
            <h1 className="display-5 mb-4">Meet Our Talented Team</h1>
          </div>
          <div className="row g-4">
            {team.map(member => (
              <div key={member._id} className="col-md-6 col-lg-6 col-xl-3">
                <div className="team-item bg-white p-3 rounded shadow-sm text-center">
                  <img src={getImageUrl(member.image)} className="img-fluid rounded mb-3" alt={member.name} onError={handleImageError} />
                  <h4>{member.name}</h4>
                  <p className="text-muted">{member.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations */}
      <div className="container-fluid contact py-5">
        <div className="container py-5">
          <h1 className="display-5 mb-5 text-center">Our Location</h1>
          <div className="row g-5">
            <div className="col-lg-4">
              <div className="bg-light rounded p-4 h-100 shadow-sm">
                <h4 className="text-primary">Headquarter</h4>
                <p>MIG-303, 4th Floor, Kalinga Vihar, Patrapada, Bhubaneswar, 751019</p>
                <p>+91 9583553382</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-light rounded p-4 h-100 shadow-sm">
                <h4 className="text-primary">Meeting Hall</h4>
                <p>C.V.Raman Global University, Bhubaneswar, Odisha, 752054</p>
                <p>+91 7978309060</p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-light rounded p-4 h-100 shadow-sm">
                <h4 className="text-primary">Factory</h4>
                <p>Near Sai Gouranga Apartments, AIIMS road, Bhubaneswar</p>
                <p>+91 9776442267</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
