// import { Link } from 'react-router-dom';

// const FloatingActions = () => {
//   return (
//     <div className="floating-buttons">
//       <Link to="/products" className="btn btn-primary">Learn More</Link>
//       <a href="tel:+919583553382" className="btn btn-primary">Call Now</a>
//       <a href="https://api.whatsapp.com/send?phone=9776442267&text=Hola!" className="btn btn-success" target="_blank" rel="noreferrer">
//         <i className="fab fa-whatsapp"></i> WhatsApp
//       </a>
//     </div>
//   );
// };

// export default FloatingActions;


import { Link } from "react-router-dom";
import { FaInfoCircle, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const FloatingActions = () => {
  return (
    <>
      <style>
        {`
          .floating-buttons {
            position: fixed;
            right: 20px;
            bottom: 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 1000;
          }

          .floating-btn {
            width: 55px;
            height: 55px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
            text-decoration: none;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }

          .floating-btn:hover {
            transform: scale(1.1);
          }

          .primary-btn {
            background: hsla(143, 77%, 36%, 1.00);
          }

          .whatsapp-btn {
            background: #25d366;
          }
        `}
      </style>

      <div className="floating-buttons">
        <Link to="/products" className="floating-btn primary-btn">
          <FaInfoCircle />
        </Link>

        <a href="tel:+919583553382" className="floating-btn primary-btn">
          <FaPhoneAlt />
        </a>

        <a
          href="https://api.whatsapp.com/send?phone=9776442267&text=Hello!%20I'm%20interested%20in%20your%20products."
          className="floating-btn whatsapp-btn"
          target="_blank"
          rel="noreferrer"
        >
          <FaWhatsapp />
        </a>
      </div>
    </>
  );
};

export default FloatingActions;