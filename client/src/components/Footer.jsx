import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart, ShieldCheck, Clock, Award, UtensilsCrossed } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="dr-footer pt-5 pb-4 mt-auto border-top footer-border font-sans">
      <div className="container">

        {/* Top 4 Highlights */}
        <div className="row g-4 pb-5 mb-5 border-bottom footer-border">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-4 bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-warning p-3 flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                <Award size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0 small">100% Home-Style</h6>
                <p className="footer-text-muted mb-0">Pure desi ghee &amp; zero preservatives</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-4 bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-success p-3 flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0 small">FSSAI Certified</h6>
                <p className="footer-text-muted mb-0">Sanitized kitchen &amp; RO purified</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-4 bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-warning p-3 flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                <Clock size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0 small">Punctual Delivery</h6>
                <p className="footer-text-muted mb-0">Hot meals on your exact time slot</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-4 bg-white bg-opacity-10 d-flex align-items-center justify-content-center text-danger p-3 flex-shrink-0" style={{ width: '48px', height: '48px' }}>
                <UtensilsCrossed size={24} />
              </div>
              <div>
                <h6 className="fw-bold text-white mb-0 small">Eco-Friendly Tiffins</h6>
                <p className="footer-text-muted mb-0">Food-grade stainless steel dabbas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="row g-4 pb-4">

          {/* Brand Col */}
          <div className="col-12 col-lg-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="logo-badge" style={{ width: '44px', height: '44px' }}>
                <img src="/logo.jpg" alt="Dabba Roti" />
              </div>
              <div>
                <h4 className="font-serif fw-bold text-white mb-0">Dabba Roti</h4>
                <p className="small text-warning fw-bold text-uppercase mb-0" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>Desi Food • Freshly Packed</p>
              </div>
            </div>

            <p className="footer-tagline mb-2">
              "A Taste You'll Keep Coming Back For!"
            </p>
            <p className="footer-text-muted mb-3">
              Mohali’s favorite homestyle daily meal service. Delivering nutritious, hygienic, and comforting tiffins straight from our mother-style kitchen to your door.
            </p>
            <div className="footer-text-muted">
              <div className="mb-1">
                Website:{' '}
                <a href="https://www.dabbaroti.com" target="_blank" rel="noreferrer" className="footer-link-highlight">
                  www.dabbaroti.com
                </a>
              </div>
              <div>Kitchen Hours: <span className="text-white fw-semibold">7:00 AM – 9:30 PM</span> (All Days)</div>
            </div>
          </div>

          {/* Plans */}
          <div className="col-6 col-md-4 col-lg-2 offset-lg-1">
            <h6 className="footer-heading">Tiffin Plans</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/plans" className="footer-link">Weekly 2-Meal Plan</Link></li>
              <li><Link to="/plans" className="footer-link">Weekly 3-Meal Plan</Link></li>
              <li><Link to="/plans" className="footer-link-highlight">Monthly 2-Meal (₹3,500)</Link></li>
              <li><Link to="/plans" className="footer-link-highlight">Monthly 3-Meal (₹4,500)</Link></li>
              <li><Link to="/custom-plan" className="footer-link-success">Build Custom Plan →</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-4 col-lg-2">
            <h6 className="footer-heading">Navigation</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              <li><Link to="/about" className="footer-link">Our Story &amp; Hygiene</Link></li>
              <li><Link to="/menu" className="footer-link">Daily Rotational Menu</Link></li>
              <li><Link to="/dashboard" className="footer-link">Customer Portal</Link></li>
              <li><Link to="/admin" className="footer-link">Admin Dashboard</Link></li>
              <li><a href="/#testimonials" className="footer-link">Customer Reviews</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-12 col-md-4 col-lg-3">
            <h6 className="footer-heading">Kitchen &amp; Contact</h6>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-warning flex-shrink-0 mt-1" />
                <span className="footer-contact-item">Phase-8, Industrial Area, Sector 73, Sahibzada Ajit Singh Nagar, Punjab 160071</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-warning flex-shrink-0" />
                <a href="tel:+919876543210" className="footer-contact-item fw-semibold">+91 7055711006</a>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-warning flex-shrink-0" />
                <a href="mailto:dabbaroti0@gmail.com" className="footer-contact-item">dabbaroti0@gmail.com</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-top footer-border d-flex flex-column flex-sm-row align-items-center justify-content-between footer-text-muted gap-2">
          <p className="mb-0">© {new Date().getFullYear()} Dabba Roti (<a href="https://www.dabbaroti.com" className="footer-contact-item text-decoration-underline">www.dabbaroti.com</a>). All rights reserved.</p>
          <p className="mb-0 d-flex align-items-center gap-1">
            Made with <Heart size={14} className="text-danger fill-danger" /> for everyday healthy living.
          </p>
        </div>

      </div>
    </footer>
  );
}
