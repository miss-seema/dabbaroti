import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  Calendar,
  Tag,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus
} from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    updateItemStartDate,
    clearCart,
    subtotal,
    deliveryCharge,
    discount,
    total,
    appliedCoupon,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    await applyCouponCode(couponInput.trim());
    setApplyingCoupon(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 text-center font-sans" style={{ maxWidth: '600px' }}>
        <div className="rounded-circle bg-cream text-roast d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '88px', height: '88px' }}>
          <ShoppingBag size={42} strokeWidth={1.5} />
        </div>
        <h2 className="font-serif fw-bold text-roast fs-2 mb-2">Your Tiffin Cart is Empty</h2>
        <p className="text-muted small leading-relaxed mb-4">
          Looks like you haven't selected a daily meal plan yet. Choose from our popular weekly or monthly plans to get fresh, hygienic home-style meals delivered daily.
        </p>
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          <Link to="/plans" className="btn btn-roast px-4 py-2.5 rounded-3 fw-bold small">
            Explore Tiffin Plans
          </Link>
          <Link to="/custom-plan" className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold small">
            Build Custom Plan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 font-sans">
      
      {/* Title */}
      <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
        <div>
          <h2 className="font-serif fw-bold text-roast mb-1">Tiffin Cart &amp; Checkout</h2>
          <p className="text-muted small mb-0">Review your meal plans and scheduled start dates</p>
        </div>
        <button
          onClick={clearCart}
          className="btn btn-link text-danger p-0 small fw-bold text-decoration-none d-flex align-items-center gap-1"
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="row g-4">
        
        {/* Cart Items List */}
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
              <div key={item.cartId} className="card dr-card p-4">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
                  
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80'}
                      alt={item.title || item.name}
                      className="rounded-3 object-fit-cover flex-shrink-0"
                      style={{ width: '70px', height: '70px' }}
                    />
                    <div>
                      <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-1">
                        {item.type === 'weekly' ? '7-Day Plan' : item.type === 'monthly' ? '30-Day Plan' : 'Menu Item'}
                      </span>
                      <h5 className="font-serif fw-bold text-roast mb-0 fs-6">
                        {item.title || item.name}
                      </h5>
                      <span className="fw-black text-secondary fs-6 font-serif">
                        ₹{item.price?.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Dates */}
                  <div className="d-flex flex-wrap align-items-center gap-3 w-100 w-sm-auto justify-content-between justify-content-sm-end">
                    {item.itemType === 'plan' && (
                      <div>
                        <label className="form-label small text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                          <Calendar size={12} className="text-secondary" />
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={item.startDate || ''}
                          onChange={(e) => updateItemStartDate(item.cartId, e.target.value)}
                          className="form-control form-control-sm rounded-3 py-1 bg-light fw-semibold"
                        />
                      </div>
                    )}

                    {/* Qty Controls */}
                    <div className="d-flex align-items-center gap-2 bg-light p-1 rounded-3 border">
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                        className="btn btn-sm btn-white border rounded-2 p-1"
                        style={{ width: '26px', height: '26px' }}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="fw-bold small text-dark px-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                        className="btn btn-sm btn-roast rounded-2 p-1 text-white"
                        style={{ width: '26px', height: '26px' }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="btn btn-link text-muted hover-danger p-1"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                </div>
              </div>
            ))}

            <div className="card dr-card p-3 bg-cream border d-flex flex-row align-items-center justify-content-between small">
              <span className="text-roast fw-medium">Want to add hot rotis or chilled chaas?</span>
              <Link to="/menu" className="fw-bold text-secondary text-decoration-none">Browse Menu →</Link>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card dr-card p-4 shadow-lg sticky-top" style={{ top: '100px' }}>
            <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3">Order Summary</h5>

            <div className="d-flex flex-column gap-2 small text-muted mb-3">
              <div className="d-flex justify-content-between">
                <span>Subtotal ({cartItems.length} items):</span>
                <strong className="text-dark">₹{subtotal.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Doorstep Delivery:</span>
                {deliveryCharge === 0 ? (
                  <strong className="text-success">FREE</strong>
                ) : (
                  <strong className="text-dark">₹{deliveryCharge}</strong>
                )}
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success fw-bold">
                  <span>Coupon ({appliedCoupon?.code}):</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-baseline pt-3 border-top mt-2">
                <div>
                  <span className="fw-bold text-dark fs-6 d-block">Final Total:</span>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Taxes &amp; Delivery Included</span>
                </div>
                <span className="fs-2 fw-black text-secondary font-serif">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="pt-2 border-top mb-3">
              <label className="form-label small fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <Tag size={13} className="text-secondary" />
                Promo Coupon
              </label>

              {appliedCoupon ? (
                <div className="p-2 rounded-3 bg-success bg-opacity-10 border border-success d-flex align-items-center justify-content-between small text-success">
                  <div>
                    <span className="fw-bold">{appliedCoupon.code}</span>
                    <span className="small d-block" style={{ fontSize: '0.7rem' }}>Saved ₹{appliedCoupon.discountAmount}!</span>
                  </div>
                  <button onClick={removeCoupon} className="btn btn-sm btn-link text-danger p-0 fw-bold small text-decoration-none">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="input-group input-group-sm">
                  <input
                    type="text"
                    placeholder="DABBA10 or TASTE20"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="form-control rounded-start-3 text-uppercase font-monospace fw-bold bg-light"
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="btn btn-roast rounded-end-3 fw-bold"
                  >
                    {applyingCoupon ? '...' : 'Apply'}
                  </button>
                </form>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-terracotta w-100 py-3 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 mb-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="d-flex align-items-center justify-content-center gap-1 text-muted small" style={{ fontSize: '0.72rem' }}>
              <ShieldCheck size={14} className="text-success" />
              <span>Razorpay Verified &amp; Cash Payment</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
