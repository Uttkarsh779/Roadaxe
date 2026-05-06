import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      if (res.data.status === 'success') {
        const userData = res.data.data.user;
        login(userData, res.data.token);
        
        // Check for redirect param
        const searchParams = new URLSearchParams(location.search);
        const redirect = searchParams.get('redirect');
        
        if (redirect) {
          navigate(redirect);
        } else if (userData.role === 'admin') {
          navigate('/dash');
        } else if (userData.role === 'dealer') {
          navigate('/dealership');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
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
                  Welcome to the Future of
                  <br />
                  <span className="text-primary">Sustainable Mobility!</span>
                </h1>
                <p style={{ color: 'hsl(217, 10%, 50.8%)' }}>
                  Sign up now to embark on an electrifying adventure with Road Axe Motors.
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="card">
                  <div className="card-body py-5 px-md-5">
                    <form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="email">Email address</label>
                        <input 
                          type="email" 
                          id="email" 
                          className="form-control" 
                          placeholder="Enter Email" 
                          name="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input 
                          type="password" 
                          id="password" 
                          className="form-control" 
                          placeholder="Enter Password" 
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <button 
                        type="submit" 
                        className="btn btn-primary btn-block mb-4" 
                        style={{ width: '100%' }}
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Sign In'}
                      </button>

                      <p style={{ textAlign: 'center' }}>
                        New here? <Link to="/signup">Sign Up!</Link>
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

export default Login;
