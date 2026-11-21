import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Tiffin Plans', path: '/plans' },
    { name: 'Custom Plan', path: '/custom-plan', highlight: true },
    { name: 'Daily Menu', path: '/menu' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky-top shadow-sm z-3">
      {/* Top micro banner in rich logo brown */}
      <div className="bg-roast py-1 px-3 text-center text-white small fw-medium d-flex align-items-center justify-content-center gap-2 border-bottom border-dark border-opacity-25">
        <Sparkles size={14} className="text-warning" />
        <span className="small">
          Fresh Home-Style Daily Tiffins • Use Coupon <strong className="text-warning text-decoration-underline">DABBA10</strong> for 10% Off
        </span>
      </div>

      {/* Main Glassmorphic Navbar */}
      <nav className="navbar navbar-expand-lg dr-navbar py-2">
        <div className="container">
          
          {/* Logo & Brand */}
          <Link to="/" className="navbar-brand d-flex align-items-center gap-3 text-decoration-none">
            <div className="logo-badge">
              <img
                src="/logo.jpg"
                alt="Dabba Roti Logo"
              />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="font-serif fs-4 fw-black text-roast mb-0 lh-1">
                  Dabba Roti
                </span>
                <span className="badge rounded-pill bg-success p-1" style={{ width: '8px', height: '8px' }}></span>
              </div>
              <p className="small text-muted fw-bold text-uppercase mb-0 tracking-wider" style={{ fontSize: '0.65rem' }}>
                Desi Food • Freshly Packed
              </p>
            </div>
          </Link>

          {/* Mobile Right Icons (Cart + Toggle) */}
          <div className="d-flex align-items-center gap-2 d-lg-none ms-auto me-2">
            <Link
              to="/cart"
              className="btn btn-outline-secondary rounded-3 p-2 position-relative border-opacity-50"
              title="View Cart"
            >
              <ShoppingBag size={18} className="text-roast" />
              {totalItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                  {totalItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-outline-secondary rounded-3 p-2 border-opacity-50"
              type="button"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>

          {/* Desktop Links */}
          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-center">
            <ul className="navbar-nav gap-1">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link
                    to={link.path}
                    className={`dr-nav-link position-relative ${isActive(link.path) ? 'active' : ''}`}
                  >
                    {link.name}
                    {link.highlight && (
                      <span className="badge rounded-pill bg-success ms-1" style={{ fontSize: '0.6rem' }}>
                        NEW
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Auth & Cart */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            <Link
              to="/cart"
              className="btn btn-outline-secondary rounded-4 p-2 position-relative border-opacity-50 bg-white"
              title="View Cart"
            >
              <ShoppingBag size={20} className="text-roast" />
              {totalItemsCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="position-relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="btn btn-light rounded-4 border d-flex align-items-center gap-2 py-1 px-3 text-start bg-white"
                >
                  <div className="rounded-circle bg-roast text-white d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.85rem' }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="fw-bold text-roast lh-1 small">{user.name.split(' ')[0]}</div>
                    <span className="text-muted text-uppercase" style={{ fontSize: '0.65rem' }}>{user.role}</span>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="position-absolute end-0 mt-2 bg-white rounded-4 shadow-lg border p-2 z-3"
                    style={{ minWidth: '220px' }}
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-bottom mb-1">
                      <div className="fw-bold text-dark small text-truncate">{user.name}</div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>{user.email}</div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="dropdown-item rounded-3 py-2 px-3 small fw-semibold text-secondary d-flex align-items-center gap-2"
                    >
                      <LayoutDashboard size={16} />
                      Subscriptions & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="dropdown-item rounded-3 py-2 px-3 small fw-bold text-warning bg-warning bg-opacity-10 d-flex align-items-center gap-2 my-1"
                      >
                        <ShieldCheck size={16} />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-top pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="dropdown-item rounded-3 py-2 px-3 small fw-bold text-danger d-flex align-items-center gap-2"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-roast btn-sm rounded-3 px-3 py-2">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-roast btn-sm rounded-3 px-3 py-2">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="d-lg-none w-100 bg-white border-top border-bottom py-3 px-4 shadow-sm">
            <ul className="navbar-nav gap-2">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-link fw-bold px-3 py-2 rounded-3 d-flex justify-content-between align-items-center ${
                      isActive(link.path) ? 'bg-cream text-roast' : 'text-dark'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.highlight && (
                      <span className="badge rounded-pill bg-success">
                        CUSTOMIZE
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="border-top pt-3 mt-3">
              {!isAuthenticated ? (
                <div className="row g-2">
                  <div className="col-6">
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-outline-roast w-100 fw-bold small"
                    >
                      Log In
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-roast w-100 fw-bold small"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn btn-light border text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3"
                  >
                    <LayoutDashboard size={16} />
                    <span>Customer Portal</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="btn btn-warning bg-opacity-10 border text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 text-warning fw-bold"
                    >
                      <ShieldCheck size={16} />
                      <span>Admin Control Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="btn btn-outline-danger text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 mt-1"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
