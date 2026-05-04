import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (res.data.status === 'success') {
        login(res.data.data.user, res.data.token);
        navigate('/');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setMessage(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .navbar-light .navbar-nav .nav-item .nav-link {
          color: var(--bs-primary);
        }
        .navbar-light .navbar-nav .nav-link {
          font-family: 'Roboto', sans-serif;
          position: relative;
          margin-right: 25px;
          padding: 35px 0;
          color: var(--bs-primary);
          font-size: 17px;
          font-weight: 400;
          outline: none;
          transition: .5s;
        }
      `}</style>

      <div className="container-fluid" style={{ height: '90px' }}></div>
      <br />
      
      <section className="">
        <div className="px-4 py-5 px-md-5 text-center text-lg-start" style={{ backgroundColor: 'hsl(0, 0%, 96%)' }}>
          <div className="container">
            <div className="row gx-lg-5 align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <h1 className="my-5 display-3 fw-bold ls-tight">
                  Join the Road to 
                  <br />
                  <span className="text-primary">Innovation!</span>
                </h1>
                <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                  Sign up today and drive into a world of electric possibilities.
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="formName">Full Name</label>
                        <input 
                          type="text" 
                          id="formName" 
                          className="form-control" 
                          placeholder="Enter Full Name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="formEmail">Email Address</label>
                        <input 
                          type="email" 
                          id="formEmail" 
                          className="form-control" 
                          placeholder="Enter Email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="formPassword">Password</label>
                        <input 
                          type="password" 
                          id="formPassword" 
                          className="form-control" 
                          placeholder="Enter Password" 
                          name="password" 
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="formConfirmPassword">Confirm Password</label>
                        <input 
                          type="password" 
                          id="formConfirmPassword" 
                          className="form-control" 
                          placeholder="Confirm Password" 
                          name="confirmPassword" 
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary btn-block mb-4" 
                        style={{ width: '100%' }}
                        disabled={loading}
                      >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                      </button>

                      <p style={{ textAlign: 'center' }}>
                        Already have an account? <Link to="/login">Login here</Link>
                      </p>

                      {message && (
                        <div className="alert alert-danger mt-3">
                          <p style={{ margin: 0 }}>{message}</p>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
