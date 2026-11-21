import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    }
  };

  const fillDemoCustomer = () => {
    setEmail('customer@dabbaroti.com');
    setPassword('User@123');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@dabbaroti.com');
    setPassword('Admin@123');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center font-sans" style={{ minHeight: '75vh' }}>
      <div className="card dr-card p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: '440px' }}>
        
        {/* Logo and Tagline */}
        <div className="text-center mb-4">
          <div className="logo-badge mb-3 shadow" style={{ width: '68px', height: '68px', borderWidth: '3px' }}>
            <img src="/logo.jpg" alt="Dabba Roti Logo" />
          </div>
          <h3 className="font-serif fw-bold text-roast mb-1">Welcome Back</h3>
          <p className="small text-secondary fw-bold text-uppercase mb-1" style={{ fontSize: '0.65rem' }}>Desi Food • Freshly Packed</p>
          <p className="text-muted small mb-0">Sign in to manage your tiffin subscriptions</p>
        </div>

        {/* 1-Click Demo Buttons */}
        <div className="p-3 bg-cream rounded-3 border mb-4">
          <p className="small text-uppercase fw-bold text-roast text-center mb-2" style={{ fontSize: '0.65rem' }}>
            Demo Credentials (1-Click Fill)
          </p>
          <div className="row g-2">
            <div className="col-6">
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="btn btn-white bg-white border w-100 py-1.5 px-2 text-dark small fw-bold"
                style={{ fontSize: '0.75rem' }}
              >
                👤 Customer Demo
              </button>
            </div>
            <div className="col-6">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-roast w-100 py-1.5 px-2 text-white small fw-bold"
                style={{ fontSize: '0.75rem' }}
              >
                🛡️ Admin Demo
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 small">
          <div>
            <label className="form-label fw-bold text-dark mb-1">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Mail size={16} className="text-muted" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="form-control rounded-end-3 border-start-0 bg-light"
              />
            </div>
          </div>

          <div>
            <label className="form-label fw-bold text-dark mb-1">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Lock size={16} className="text-muted" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-control rounded-end-3 border-start-0 bg-light"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-terracotta w-100 py-2.5 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 mt-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="text-center small text-muted mt-4">
          Don't have an account yet?{' '}
          <Link to="/register" className="fw-bold text-secondary text-decoration-none">
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
}
