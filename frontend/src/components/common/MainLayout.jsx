import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingActions from './FloatingActions';
import { useEffect } from 'react';

const MainLayout = () => {

  useEffect(() => {
    // Initialize WOW js on main layout mount
    if (window.WOW) {
      new window.WOW().init();
    }
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Dynamic Page Content rendered here */}
      <Outlet />

      <Footer />
      <FloatingActions />
    </>
  );
};

export default MainLayout;
