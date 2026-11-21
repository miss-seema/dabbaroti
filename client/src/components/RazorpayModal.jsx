import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, Smartphone, Building, RefreshCw, X } from 'lucide-react';

export default function RazorpayModal({ isOpen, onClose, onPaymentSuccess, orderDetails }) {
  const [selectedMethod, setSelectedMethod] = useState('upi'); // 'upi', 'card', 'netbanking'
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedPayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase();
      onPaymentSuccess({
        razorpay_payment_id: fakePaymentId,
        razorpay_order_id: orderDetails?.razorpayOrderId || 'order_sim_' + Date.now(),
        razorpay_signature: 'sig_simulated_valid_test'
      });
    }, 1200);
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}>
      <div className="card dr-card overflow-hidden shadow-lg border-0 w-100" style={{ maxWidth: '440px' }}>
        
        {/* Modal Header */}
        <div className="bg-primary text-white p-4 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-3 bg-white bg-opacity-15 p-2 d-flex align-items-center justify-content-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-uppercase small fw-bold text-white text-opacity-75 mb-0" style={{ fontSize: '0.65rem' }}>Secure Checkout</p>
              <h5 className="fw-bold text-white mb-0 font-serif">Razorpay Payments</h5>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-link text-white p-0" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Order Amount Banner */}
        <div className="bg-light px-4 py-3 border-bottom d-flex align-items-center justify-content-between">
          <div>
            <span className="small text-muted d-block" style={{ fontSize: '0.75rem' }}>Dabba Roti Subscription</span>
            <span className="small font-monospace text-dark fw-bold">{orderDetails?.orderNumber || 'DR-ORD-NEW'}</span>
          </div>
          <div className="text-end">
            <span className="fs-4 fw-black text-roast font-serif">₹{orderDetails?.totalAmount?.toLocaleString() || '0'}</span>
            <span className="small d-block text-success fw-bold" style={{ fontSize: '0.7rem' }}>✓ Test Sandbox Active</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card-body p-4">
          <p className="small fw-bold text-uppercase text-muted mb-2 tracking-wider" style={{ fontSize: '0.7rem' }}>Select Payment Option</p>

          <div className="row g-2 mb-3">
            <div className="col-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`btn w-100 p-2 rounded-3 text-center border ${
                  selectedMethod === 'upi' ? 'btn-roast' : 'btn-light border-secondary border-opacity-25 text-dark'
                }`}
              >
                <Smartphone size={20} className="d-block mx-auto mb-1" />
                <span className="small fw-bold d-block" style={{ fontSize: '0.75rem' }}>UPI / QR</span>
              </button>
            </div>

            <div className="col-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('card')}
                className={`btn w-100 p-2 rounded-3 text-center border ${
                  selectedMethod === 'card' ? 'btn-roast' : 'btn-light border-secondary border-opacity-25 text-dark'
                }`}
              >
                <CreditCard size={20} className="d-block mx-auto mb-1" />
                <span className="small fw-bold d-block" style={{ fontSize: '0.75rem' }}>Cards</span>
              </button>
            </div>

            <div className="col-4">
              <button
                type="button"
                onClick={() => setSelectedMethod('netbanking')}
                className={`btn w-100 p-2 rounded-3 text-center border ${
                  selectedMethod === 'netbanking' ? 'btn-roast' : 'btn-light border-secondary border-opacity-25 text-dark'
                }`}
              >
                <Building size={20} className="d-block mx-auto mb-1" />
                <span className="small fw-bold d-block" style={{ fontSize: '0.75rem' }}>NetBanking</span>
              </button>
            </div>
          </div>

          {/* Form details for chosen method */}
          {selectedMethod === 'upi' && (
            <div className="bg-light p-3 rounded-3 border mb-3">
              <label className="form-label small fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>UPI ID (VPA)</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@bank"
                className="form-control form-control-sm rounded-3"
              />
              <p className="text-muted small mt-1 mb-0" style={{ fontSize: '0.7rem' }}>Google Pay, PhonePe, Paytm, BHIM</p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="bg-light p-3 rounded-3 border mb-3">
              <label className="form-label small fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>Card Details (Simulated)</label>
              <input
                type="text"
                disabled
                value="4111 •••• •••• 1111 (Visa Sandbox)"
                className="form-control form-control-sm rounded-3 font-monospace mb-2"
              />
              <div className="row g-2">
                <div className="col-6">
                  <input type="text" disabled value="Exp: 12/28" className="form-control form-control-sm rounded-3 text-center" />
                </div>
                <div className="col-6">
                  <input type="text" disabled value="CVV: 123" className="form-control form-control-sm rounded-3 text-center" />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="bg-light p-3 rounded-3 border mb-3">
              <label className="form-label small fw-bold text-dark mb-1" style={{ fontSize: '0.75rem' }}>Popular Banks</label>
              <select className="form-select form-select-sm rounded-3">
                <option>HDFC Bank</option>
                <option>State Bank of India (SBI)</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
                <option>Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* Guarantee */}
          <div className="d-flex align-items-center gap-1 text-muted small mb-3" style={{ fontSize: '0.75rem' }}>
            <Lock size={14} className="text-success" />
            <span>256-bit SSL encrypted. 100% Secure Checkout.</span>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            onClick={handleSimulatedPayment}
            disabled={processing}
            className="btn btn-terracotta w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
          >
            {processing ? (
              <>
                <RefreshCw size={18} className="spinner-border spinner-border-sm" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Pay ₹{orderDetails?.totalAmount?.toLocaleString() || '0'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
