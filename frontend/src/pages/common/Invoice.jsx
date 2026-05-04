import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Invoice = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setOrder(res.data.data.order);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, API_URL]);

  if (loading) return <div className="p-5 text-center">Loading Invoice...</div>;
  if (!order) return <div className="p-5 text-center text-danger">Invoice not found.</div>;

  return (
    <div className="container py-5">
      <style>{`
        @media print {
          .btn-print { display: none; }
          body { padding: 0; background: white; }
          .card { border: none !important; box-shadow: none !important; }
        }
      `}</style>
      <div className="card shadow-sm border">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Invoice <strong>#{order.invoice_number}</strong></h5>
          <button className="btn btn-primary btn-sm btn-print" onClick={() => window.print()}>
            <i className="bi bi-print me-1"></i> Print
          </button>
        </div>
        <div className="card-body p-4">
           {/* Reusing the same layout as Payment.jsx for 1:1 parity */}
           <div className="row mb-5">
              <div className="col-sm-6">
                <h6>From:</h6>
                <strong>Road Axe Motors Pvt Ltd</strong><br/>
                MIG-281, Kalinga Vihar, Patrapada<br/>
                Bhubaneswar, Odisha - 751019
              </div>
              <div className="col-sm-6 text-sm-end">
                <h6>To:</h6>
                <strong>{order.first_name} {order.last_name}</strong><br/>
                {order.address}<br/>
                {order.city}, {order.state} - {order.pincode}
              </div>
           </div>
           <table className="table table-bordered">
             <thead className="table-light">
               <tr>
                 <th>Product</th>
                 <th>Qty</th>
                 <th className="text-end">Total</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>{order.product}</td>
                 <td>{order.quantity}</td>
                 <td className="text-end">₹ {order.total_price_including_gst}</td>
               </tr>
             </tbody>
           </table>
           <div className="text-end mt-4">
             <h4>Grand Total: ₹ {order.total_price_including_gst}</h4>
             <p className="text-success fw-bold">Payment Status: {order.payment_status}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
