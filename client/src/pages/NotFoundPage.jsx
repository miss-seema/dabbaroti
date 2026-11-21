import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container py-5 text-center font-sans d-flex align-items-center justify-content-center" style={{ minHeight: '65vh' }}>
      <div style={{ maxWidth: '480px' }}>
        <div className="logo-badge mb-3 shadow mx-auto" style={{ width: '80px', height: '80px', borderWidth: '3px' }}>
          <img src="/logo.jpg" alt="Dabba Roti" />
        </div>
        <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
          404 Error
        </span>
        <h2 className="font-serif fw-bold text-roast fs-2 mb-2">
          Looks Like This Dabba is Empty!
        </h2>
        <p className="text-muted small leading-relaxed mb-4">
          The page you are looking for might have been moved or does not exist. Let's get you back to today's hot meal menu.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <Link to="/" className="btn btn-roast px-4 py-2.5 rounded-3 fw-bold small d-inline-flex align-items-center gap-2">
            <Home size={16} />
            <span>Go to Home</span>
          </Link>
          <Link to="/plans" className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold small">
            Explore Plans
          </Link>
        </div>
      </div>
    </div>
  );
}
