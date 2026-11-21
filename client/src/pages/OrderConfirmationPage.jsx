import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const order = location.state?.order;
  const isPaid = location.state?.isPaid;

  return (
    <div className="container py-5 text-center font-sans" style={{ maxWidth: '720px' }}>

      {/* Brand Logo & Success Badge */}
      <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
        <div className="logo-badge" style={{ width: '64px', height: '64px', borderWidth: '3px' }}>
          <img src="/logo.jpg" alt="Dabba Roti Logo" />
        </div>
        <div className="rounded-circle bg-success bg-opacity-15 text-success d-flex align-items-center justify-content-center shadow-sm" style={{ width: '56px', height: '56px' }}>
          <CheckCircle2 size={32} strokeWidth={2.5} />
        </div>
      </div>

      <div className="mb-4">
        <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
          Order Confirmed
        </span>
        <h2 className="font-serif fw-bold text-roast fs-2 mb-2">
          A Taste You'll Keep Coming Back For!
        </h2>
        <p className="text-muted small col-lg-9 mx-auto leading-relaxed mb-0">
          Thank you for trusting Dabba Roti! Your daily tiffin subscription has been confirmed and scheduled in our central kitchen.
        </p>
      </div>

      {/* Invoice Card */}
      <div className="card dr-card p-4 p-md-5 text-start shadow-lg mb-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
          <div>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Order Reference:</span>
            <div className="font-monospace fw-bold text-dark fs-6">{orderNumber}</div>
          </div>
          <div className="text-end">
            <span className="badge bg-success bg-opacity-15 text-success py-2 px-3 fw-bold small">
              {isPaid || order?.paymentStatus === 'paid' ? 'Paid Online (Razorpay)' : 'Pay on Delivery (COD)'}
            </span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-3 small">
          <div className="fw-bold text-dark d-flex align-items-center gap-1 mb-1">
            <MapPin size={14} className="text-secondary" />
            <span>Delivery Destination:</span>
          </div>
          <p className="text-muted mb-0 ps-3">
            {order?.deliveryAddress?.name && <strong className="text-dark">{order.deliveryAddress.name} • </strong>}
            {order?.deliveryAddress?.street || 'Mohali Central'}, {order?.deliveryAddress?.area || 'Vijay Nagar'}, Mohali - {order?.deliveryAddress?.pincode || '452010'}
          </p>
        </div>

        {/* Slots */}
        <div className="row g-2 mb-4">
          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3 bg-light border d-flex align-items-center gap-2 small">
              <Clock size={16} className="text-warning flex-shrink-0" />
              <div>
                <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Lunch Slot:</span>
                <strong className="text-dark">{order?.deliverySlot?.lunch || '12:00 PM - 01:30 PM'}</strong>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="p-3 rounded-3 bg-light border d-flex align-items-center gap-2 small">
              <Clock size={16} className="text-secondary flex-shrink-0" />
              <div>
                <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Dinner Slot:</span>
                <strong className="text-dark">{order?.deliverySlot?.dinner || '07:30 PM - 09:00 PM'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Total Paid */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <div>
            <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>Total Subscription Amount</span>
            <span className="fs-3 fw-black text-secondary font-serif">₹{order?.totalAmount?.toLocaleString() || '3,500'}</span>
          </div>
          <div className="badge rounded-pill bg-cream text-roast border py-2 px-3 fw-bold d-flex align-items-center gap-1">
            <ShieldCheck size={14} className="text-success" />
            <span>Active Subscription</span>
          </div>
        </div>

      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
        <Link to="/dashboard" className="btn btn-roast px-4 py-2.5 rounded-3 fw-bold small d-inline-flex align-items-center justify-content-center gap-2">
          <span>Go to Customer Dashboard</span>
          <ArrowRight size={16} />
        </Link>
        <Link to="/" className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold small">
          Back to Home
        </Link>
      </div>

    </div>
  );
}
