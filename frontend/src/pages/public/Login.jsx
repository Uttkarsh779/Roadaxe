import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL ?? '';

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      if (res.data.status === 'success') {
        if (res.data.token) {
          const userData = res.data.data.user;
          login(userData, res.data.token);
          
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
        } else {
          setSuccessMsg(res.data.message || 'OTP sent to your email');
          setStep(2);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
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
      console.error('OTP error:', err);
      setMessage(err.response?.data?.message || 'Invalid OTP. Please try again.');
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
                    <form onSubmit={step === 1 ? handleLoginSubmit : handleOtpSubmit}>
                      {step === 1 ? (
                        <>
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
                            {loading ? 'Sending OTP...' : 'Sign In'}
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="otp">Enter OTP sent to {email}</label>
                            <input 
                              type="text" 
                              id="otp" 
                              className="form-control" 
                              placeholder="Enter 6-digit OTP" 
                              name="otp"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              required
                            />
                          </div>

                          <button 
                            type="submit" 
                            className="btn btn-primary btn-block mb-4" 
                            style={{ width: '100%' }}
                            disabled={loading}
                          >
                            {loading ? 'Verifying...' : 'Verify OTP & Login'}
                          </button>
                          
                          <div className="text-center mb-3">
                            <button 
                              type="button" 
                              className="btn btn-link" 
                              onClick={() => { setStep(1); setSuccessMsg(''); setMessage(''); }}
                            >
                              Back to Login
                            </button>
                          </div>
                        </>
                      )}

                      {step === 1 && (
                        <p style={{ textAlign: 'center' }}>
                          New here? <Link to="/signup">Sign Up!</Link>
                        </p>
                      )}

                      {successMsg && (
                        <div className="alert alert-success mt-3">
                          <p style={{ margin: 0 }}>{successMsg}</p>
                        </div>
                      )}

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
