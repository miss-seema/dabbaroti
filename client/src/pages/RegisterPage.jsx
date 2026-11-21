import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    area: '',
    pincode: '',
    landmark: ''
  });
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center font-sans" style={{ minHeight: '80vh' }}>
      <div className="card dr-card p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: '480px' }}>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="logo-badge mb-3 shadow" style={{ width: '68px', height: '68px', borderWidth: '3px' }}>
            <img src="/logo.jpg" alt="Dabba Roti Logo" />
          </div>
          <h3 className="font-serif fw-bold text-roast mb-1">Create an Account</h3>
          <p className="small text-secondary fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Desi Food • Freshly Packed</p>
          <p className="text-muted small mb-0">Subscribe and savor authentic home-cooked meals every day</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 small">
          <div className="row g-2">
            <div className="col-12 col-sm-6">
              <label className="form-label fw-bold text-dark mb-1">Full Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                className="form-control form-control-sm rounded-3 bg-light"
              />
            </div>
            <div className="col-12 col-sm-6">
              <label className="form-label fw-bold text-dark mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 7055711006"
                className="form-control form-control-sm rounded-3 bg-light"
              />
            </div>
          </div>

          <div>
            <label className="form-label fw-bold text-dark mb-1">Email Address *</label>
            <input
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aarav@example.com"
              className="form-control form-control-sm rounded-3 bg-light"
            />
          </div>

          <div>
            <label className="form-label fw-bold text-dark mb-1">Password *</label>
            <input
              type="password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className="form-control form-control-sm rounded-3 bg-light"
            />
          </div>

          {/* Optional Address */}
          <div className="pt-2 border-top">
            <label className="form-label fw-bold text-roast mb-2">Primary Delivery Address (Optional)</label>
            <div className="mb-2">
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Flat / Building / Street"
                className="form-control form-control-sm rounded-3 bg-light"
              />
            </div>
            <div className="row g-2">
              <div className="col-6">
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area (Vijay Nagar)"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="col-6">
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Pincode (452010)"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-terracotta w-100 py-2.5 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 mt-2"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register &amp; Start Eating Well</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center small text-muted mt-4">
          Already registered?{' '}
          <Link to="/login" className="fw-bold text-secondary text-decoration-none">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
