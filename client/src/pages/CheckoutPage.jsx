import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import RazorpayModal from '../components/RazorpayModal';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryCharge, discount, total, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: user?.addresses?.[0]?.street || '',
    area: user?.addresses?.[0]?.area || '',
    city: user?.addresses?.[0]?.city || 'Mohali',
    pincode: user?.addresses?.[0]?.pincode || '',
    landmark: user?.addresses?.[0]?.landmark || '',
    deliveryInstructions: ''
  });

  const [slots, setSlots] = useState({
    breakfast: '07:30 AM - 08:30 AM',
    lunch: '12:00 PM - 01:30 PM',
    dinner: '07:30 PM - 09:00 PM'
  });

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [placingOrder, setPlacingOrder] = useState(false);

  const [razorpayModalOpen, setRazorpayModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in or create an account to complete your order.');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!formData.name || !formData.phone || !formData.street || !formData.pincode) {
      toast.error('Please fill in all required delivery fields.');
      return;
    }

    setPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          itemType: item.itemType || 'plan',
          planId: item.planId,
          name: item.title || item.name,
          type: item.type,
          price: item.price,
          quantity: item.quantity || 1,
          startDate: item.startDate,
          durationDays: item.durationDays,
          mealsPerDay: item.mealsPerDay,
          selectedMeals: item.selectedMeals
        })),
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          pincode: formData.pincode,
          landmark: formData.landmark
        },
        deliverySlot: slots,
        deliveryInstructions: formData.deliveryInstructions,
        couponCode: appliedCoupon?.code || '',
        paymentMethod
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        const createdOrder = res.order;

        if (paymentMethod === 'cod') {
          clearCart();
          toast.success('Your Dabba Roti order has been placed successfully!');
          navigate(`/order-success/${createdOrder.orderNumber}`, { state: { order: createdOrder } });
        } else {
          setCurrentOrder(createdOrder);
          setRazorpayModalOpen(true);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    setRazorpayModalOpen(false);
    try {
      const verifyRes = await api.verifyRazorpayPayment({
        ...paymentDetails,
        orderId: currentOrder._id,
        orderNumber: currentOrder.orderNumber
      });

      if (verifyRes.success) {
        clearCart();
        toast.success('Payment verified! Your tiffin subscription is now active.');
        navigate(`/order-success/${currentOrder.orderNumber}`, { state: { order: currentOrder, isPaid: true } });
      }
    } catch (err) {
      toast.error('Payment verification issue: ' + err.message);
    }
  };

  return (
    <div className="container py-5 font-sans">

      {/* Title */}
      <div className="mb-4">
        <h2 className="font-serif fw-bold text-roast mb-1">Delivery &amp; Payment</h2>
        <p className="text-muted small mb-0">Provide your delivery address and schedule your daily tiffin drops</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="row g-4">

        {/* Left Form */}
        <div className="col-12 col-lg-8">

          {/* Address Details */}
          <div className="card dr-card p-4 p-md-4 mb-4">
            <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3 d-flex align-items-center gap-2">
              <MapPin size={18} className="text-secondary" />
              <span>Delivery Address</span>
            </h5>

            <div className="row g-3 small">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Aarav Sharma"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark mb-1">Phone Number (For Delivery Calls) *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 7055711006"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold text-dark mb-1">Street Address (Flat/House No., Society) *</label>
                <input
                  type="text"
                  required
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Flat 402, Shanti Heights, AB Road"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark mb-1">Area / Locality *</label>
                <input
                  type="text"
                  required
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Geeta Bhawan / Vijay Nagar"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-6 col-sm-3">
                <label className="form-label fw-bold text-dark mb-1">City</label>
                <input
                  type="text"
                  readOnly
                  value="Mohali (PB)"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-6 col-sm-3">
                <label className="form-label fw-bold text-dark mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="452001"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="Opposite State Bank"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-bold text-dark mb-1">Delivery Instructions</label>
                <input
                  type="text"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  placeholder="Leave at doorstep / call before arriving"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
            </div>
          </div>

          {/* Preferred Delivery Time Slots */}
          <div className="card dr-card p-4 p-md-4 mb-4">
            <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3 d-flex align-items-center gap-2">
              <Clock size={18} className="text-warning" />
              <span>Preferred Delivery Windows</span>
            </h5>

            <div className="row g-3 small">
              <div className="col-12 col-sm-4">
                <div className="bg-light p-3 rounded-3 border">
                  <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>Breakfast Slot</label>
                  <select
                    value={slots.breakfast}
                    onChange={(e) => setSlots({ ...slots, breakfast: e.target.value })}
                    className="form-select form-select-sm rounded-3"
                  >
                    <option>07:30 AM - 08:30 AM</option>
                    <option>08:30 AM - 09:30 AM</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="bg-light p-3 rounded-3 border">
                  <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>Lunch Slot</label>
                  <select
                    value={slots.lunch}
                    onChange={(e) => setSlots({ ...slots, lunch: e.target.value })}
                    className="form-select form-select-sm rounded-3"
                  >
                    <option>12:00 PM - 01:30 PM (Standard)</option>
                    <option>01:00 PM - 02:30 PM (Late Lunch)</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-sm-4">
                <div className="bg-light p-3 rounded-3 border">
                  <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>Dinner Slot</label>
                  <select
                    value={slots.dinner}
                    onChange={(e) => setSlots({ ...slots, dinner: e.target.value })}
                    className="form-select form-select-sm rounded-3"
                  >
                    <option>07:30 PM - 09:00 PM (Standard)</option>
                    <option>08:30 PM - 09:45 PM (Late Dinner)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="card dr-card p-4 p-md-4">
            <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3 d-flex align-items-center gap-2">
              <CreditCard size={18} className="text-secondary" />
              <span>Select Payment Method</span>
            </h5>

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`card dr-card p-3 border-2 h-100 ${paymentMethod === 'razorpay' ? 'border-secondary bg-cream' : 'border'
                    }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-3 bg-primary text-white p-2">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0 small">Razorpay Online</h6>
                        <span className="text-muted small" style={{ fontSize: '0.7rem' }}>UPI, GPay, Cards, NetBanking</span>
                      </div>
                    </div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${paymentMethod === 'razorpay' ? 'bg-secondary text-white' : 'border'}`} style={{ width: '18px', height: '18px' }}>
                      {paymentMethod === 'razorpay' && <span className="bg-white rounded-circle" style={{ width: '6px', height: '6px' }}></span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`card dr-card p-3 border-2 h-100 ${paymentMethod === 'cod' ? 'border-secondary bg-cream' : 'border'
                    }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-3 bg-success text-white p-2">
                        <Banknote size={20} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0 small">Pay on Delivery (COD)</h6>
                        <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Cash or UPI upon delivery</span>
                      </div>
                    </div>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${paymentMethod === 'cod' ? 'bg-secondary text-white' : 'border'}`} style={{ width: '18px', height: '18px' }}>
                      {paymentMethod === 'cod' && <span className="bg-white rounded-circle" style={{ width: '6px', height: '6px' }}></span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Summary */}
        <div className="col-12 col-lg-4">
          <div className="card dr-card p-4 shadow-lg sticky-top" style={{ top: '100px' }}>
            <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3">Payment Breakdown</h5>

            <div className="d-flex flex-column gap-2 small text-muted mb-3">
              <div className="d-flex justify-content-between">
                <span>Items Subtotal:</span>
                <strong className="text-dark">₹{subtotal.toLocaleString()}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Delivery Charge:</span>
                {deliveryCharge === 0 ? (
                  <strong className="text-success">FREE</strong>
                ) : (
                  <strong className="text-dark">₹{deliveryCharge}</strong>
                )}
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success fw-bold">
                  <span>Discount ({appliedCoupon?.code}):</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-baseline pt-3 border-top mt-2">
                <div>
                  <span className="fw-bold text-dark fs-6 d-block">Final Payable:</span>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>All Taxes Included</span>
                </div>
                <span className="fs-2 fw-black text-secondary font-serif">
                  ₹{total.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-cream mb-4 border small">
              <div className="d-flex align-items-center gap-1 fw-bold text-roast mb-1" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} className="text-success" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.72rem' }}>
                Free pause up to 4 days anytime directly from your customer portal.
              </p>
            </div>

            <button
              type="submit"
              disabled={placingOrder}
              className="btn btn-terracotta w-100 py-3 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2"
            >
              {placingOrder ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>{paymentMethod === 'razorpay' ? 'Proceed to Razorpay' : 'Confirm Order (COD)'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>

      </form>

      {/* Razorpay Modal */}
      <RazorpayModal
        isOpen={razorpayModalOpen}
        onClose={() => setRazorpayModalOpen(false)}
        orderDetails={currentOrder}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
