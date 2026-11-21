import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Calendar,
  ShoppingBag,
  Sliders,
  User,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  Plus,
  MapPin
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ street: '', area: '', pincode: '', landmark: '' });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [subsRes, ordersRes, customRes] = await Promise.all([
        api.getMySubscriptions(),
        api.getMyOrders(),
        api.getMyCustomRequests()
      ]);

      if (subsRes.success) setSubscriptions(subsRes.data || []);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (customRes.success) setCustomRequests(customRes.data || []);
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePause = async (subId) => {
    const reason = prompt('Please mention the reason for pausing (e.g. Out of station for 3 days):');
    if (reason === null) return;

    try {
      const res = await api.pauseSubscription(subId, { reason });
      if (res.success) {
        toast.success('Subscription paused. Days will be automatically preserved.');
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not pause subscription');
    }
  };

  const handleResume = async (subId) => {
    try {
      const res = await api.resumeSubscription(subId);
      if (res.success) {
        toast.success('Subscription resumed! Your hot tiffins will resume tomorrow.');
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not resume subscription');
    }
  };

  const handleCancel = async (subId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      const res = await api.cancelSubscription(subId);
      if (res.success) {
        toast.info('Subscription has been cancelled.');
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.message || 'Could not cancel subscription');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.pincode) {
      toast.error('Street and pincode are required');
      return;
    }
    try {
      const res = await api.addAddress(newAddress);
      if (res.success) {
        toast.success('Address added successfully');
        setShowAddressModal(false);
        setNewAddress({ street: '', area: '', pincode: '', landmark: '' });
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || 'Could not add address');
    }
  };

  return (
    <div className="container py-5 font-sans">

      {/* Banner */}
      <div className="card dr-card bg-roast text-white p-4 p-md-5 mb-4 shadow-lg border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle bg-secondary text-white fs-3 fw-bold d-flex align-items-center justify-content-center shadow" style={{ width: '64px', height: '64px' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="badge rounded-pill bg-white bg-opacity-20 text-warning px-3 py-1 fw-bold text-uppercase small mb-1">
                Customer Portal
              </span>
              <h3 className="font-serif fw-bold text-white mb-0">Namaste, {user?.name}!</h3>
              <span className="text-white text-opacity-75 small">{user?.email} • {user?.phone}</span>
            </div>
          </div>

          <button
            onClick={loadDashboardData}
            className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'spinner-border spinner-border-sm' : ''} />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'subscriptions', label: `Active Plans (${subscriptions.length})`, icon: Calendar },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'custom_requests', label: `Custom Requests (${customRequests.length})`, icon: Sliders },
          { id: 'profile', label: 'Addresses & Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 ${isCurrent ? 'btn-roast' : 'btn-light border text-dark'
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Subscriptions */}
      {activeTab === 'subscriptions' && (
        <div className="row g-4">
          {subscriptions.length === 0 ? (
            <div className="col-12">
              <div className="card dr-card p-5 text-center my-3">
                <Calendar size={48} className="text-muted mx-auto mb-3" />
                <h4 className="font-serif fw-bold text-roast">No Active Subscriptions</h4>
                <p className="text-muted small mb-0">You don't have any ongoing meal plans yet. Explore our weekly and monthly plans to begin.</p>
              </div>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <div key={sub._id} className="col-12 col-md-6">
                <div className="card dr-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge rounded-pill bg-cream text-roast border small fw-bold text-uppercase mb-1">
                          {sub.planType} Subscription
                        </span>
                        <h5 className="font-serif fw-bold text-roast mb-0">{sub.planTitle}</h5>
                        <span className="font-monospace text-muted small" style={{ fontSize: '0.7rem' }}>{sub.subscriptionNumber}</span>
                      </div>
                      <span className={`badge rounded-pill text-uppercase px-2.5 py-1 fw-bold ${sub.status === 'active' ? 'bg-success bg-opacity-15 text-success' : 'bg-warning bg-opacity-15 text-warning'
                        }`}>
                        ● {sub.status}
                      </span>
                    </div>

                    <div className="row g-2 p-3 rounded-3 bg-light border my-3 small">
                      <div className="col-6">
                        <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Start Date:</span>
                        <strong className="text-dark">{new Date(sub.startDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="col-6">
                        <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Valid Until:</span>
                        <strong className="text-dark">{new Date(sub.endDate).toLocaleDateString()}</strong>
                      </div>
                    </div>

                    <div className="small text-muted d-flex flex-column gap-1 mb-3">
                      <div><strong>Meals:</strong> {sub.mealsPerDay} Meals/Day ({sub.selectedMeals?.join(' + ')})</div>
                      <div><strong>Address:</strong> {sub.deliveryAddress?.street || 'Mohali'}</div>
                    </div>

                    {sub.pauseHistory?.length > 0 && (
                      <div className="p-2 bg-warning bg-opacity-10 text-dark rounded-2 small mb-3" style={{ fontSize: '0.75rem' }}>
                        <strong>Last Pause:</strong> {sub.pauseHistory[sub.pauseHistory.length - 1].reason}
                      </div>
                    )}
                  </div>

                  <div className="d-flex gap-2 pt-3 border-top mt-auto">
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => handlePause(sub._id)}
                        className="btn btn-sm btn-outline-warning text-dark flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-1"
                      >
                        <PauseCircle size={14} />
                        <span>Pause Plan</span>
                      </button>
                    ) : sub.status === 'paused' ? (
                      <button
                        onClick={() => handleResume(sub._id)}
                        className="btn btn-sm btn-success flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-1"
                      >
                        <PlayCircle size={14} />
                        <span>Resume Plan</span>
                      </button>
                    ) : null}

                    {sub.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(sub._id)}
                        className="btn btn-sm btn-outline-danger rounded-3"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div className="card dr-card overflow-hidden">
          <div className="card-header bg-white p-3 border-bottom">
            <h5 className="font-serif fw-bold text-roast mb-0 fs-6">Orders &amp; Payment Records</h5>
          </div>

          {orders.length === 0 ? (
            <div className="p-5 text-center text-muted small">No orders recorded yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr className="text-roast fw-bold">
                    <th scope="col" className="py-3 px-3">Order #</th>
                    <th scope="col" className="py-3 px-3">Date</th>
                    <th scope="col" className="py-3 px-3">Items</th>
                    <th scope="col" className="py-3 px-3">Total</th>
                    <th scope="col" className="py-3 px-3">Payment</th>
                    <th scope="col" className="py-3 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id}>
                      <td className="py-3 px-3 font-monospace fw-bold text-dark">{ord.orderNumber}</td>
                      <td className="py-3 px-3 text-muted">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-3 text-dark">
                        {ord.items?.map((it) => `${it.name} (x${it.quantity || 1})`).join(', ')}
                      </td>
                      <td className="py-3 px-3 fw-bold text-dark">₹{ord.totalAmount?.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className={`badge rounded-pill text-uppercase ${ord.paymentStatus === 'paid' ? 'bg-success bg-opacity-15 text-success' : 'bg-warning bg-opacity-15 text-warning'
                          }`}>
                          {ord.paymentStatus} ({ord.paymentMethod})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-capitalize fw-bold text-roast">
                        {ord.orderStatus?.replace('_', ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Custom Requests */}
      {activeTab === 'custom_requests' && (
        <div className="d-flex flex-column gap-3">
          {customRequests.length === 0 ? (
            <div className="card dr-card p-5 text-center my-3">
              <Sliders size={48} className="text-muted mx-auto mb-3" />
              <h4 className="font-serif fw-bold text-roast">No Custom Inquiries</h4>
              <p className="text-muted small mb-0">You have not submitted any custom meal inquiries yet.</p>
            </div>
          ) : (
            customRequests.map((req) => (
              <div key={req._id} className="card dr-card p-4">
                <div className="d-flex justify-content-between align-items-start pb-2 border-bottom mb-3">
                  <div>
                    <span className="small text-muted font-monospace d-block" style={{ fontSize: '0.7rem' }}>Request: {req._id}</span>
                    <h5 className="font-serif fw-bold text-roast mb-0">{req.totalDays} Days Custom Schedule ({req.dietaryType})</h5>
                  </div>
                  <span className={`badge rounded-pill text-uppercase px-3 py-1.5 fw-bold ${req.status === 'approved' ? 'bg-success bg-opacity-15 text-success' : req.status === 'rejected' ? 'bg-danger bg-opacity-15 text-danger' : 'bg-warning bg-opacity-15 text-warning'
                    }`}>
                    {req.status === 'approved' ? '✓ Approved' : req.status === 'rejected' ? 'Declined' : 'Pending Review'}
                  </span>
                </div>

                <div className="row g-2 p-3 bg-light rounded-3 small mb-2">
                  <div className="col-12 col-sm-4">
                    <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Dates:</span>
                    <strong>{new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</strong>
                  </div>
                  <div className="col-12 col-sm-4">
                    <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Meals:</span>
                    <strong className="text-capitalize">{req.selectedMeals?.join(' + ')}</strong>
                  </div>
                  <div className="col-12 col-sm-4">
                    <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Quote:</span>
                    <strong className="text-secondary fs-6">₹{(req.approvedPrice || req.estimatedPrice)?.toLocaleString()}</strong>
                  </div>
                </div>

                {req.specialInstructions && (
                  <p className="small text-muted fst-italic mb-2">"{req.specialInstructions}"</p>
                )}
                {req.adminNotes && (
                  <div className="p-2 rounded-2 bg-success bg-opacity-10 text-success small">
                    <strong>Kitchen Note:</strong> {req.adminNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Addresses & Profile */}
      {activeTab === 'profile' && (
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="card dr-card p-4">
              <h5 className="font-serif fw-bold text-roast pb-2 border-bottom mb-3">Profile Information</h5>
              <div className="d-flex flex-column gap-2 small">
                <div><span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Name:</span><strong className="fs-6 text-dark">{user?.name}</strong></div>
                <div><span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Email:</span><strong className="text-dark">{user?.email}</strong></div>
                <div><span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Phone:</span><strong className="text-dark">{user?.phone}</strong></div>
                <div><span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Role:</span><span className="badge rounded-pill bg-cream text-roast border fw-bold text-uppercase">{user?.role}</span></div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card dr-card p-4">
              <div className="d-flex justify-content-between align-items-center pb-2 border-bottom mb-3">
                <h5 className="font-serif fw-bold text-roast mb-0">Delivery Addresses</h5>
                <button onClick={() => setShowAddressModal(true)} className="btn btn-sm btn-outline-roast rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
                  <Plus size={14} />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {user?.addresses?.length === 0 ? (
                  <p className="text-muted small py-3 mb-0 text-center">No addresses saved yet.</p>
                ) : (
                  user?.addresses?.map((addr, idx) => (
                    <div key={idx} className="p-3 rounded-3 bg-light border small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-bold text-dark d-flex align-items-center gap-1">
                          <MapPin size={14} className="text-secondary" />
                          <span>Address {idx + 1}</span>
                        </span>
                        {addr.isDefault && <span className="badge bg-success bg-opacity-15 text-success">Default</span>}
                      </div>
                      <p className="text-muted mb-0">{addr.street}, {addr.area}</p>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{addr.city || 'Mohali'} - {addr.pincode}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card dr-card p-4 w-100" style={{ maxWidth: '440px' }}>
            <h5 className="font-serif fw-bold text-roast mb-3">Add Delivery Address</h5>
            <form onSubmit={handleAddAddress} className="d-flex flex-column gap-2 small">
              <div>
                <label className="form-label fw-bold text-dark mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Flat No, Building, Street"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-dark mb-1">Area *</label>
                <input
                  type="text"
                  required
                  placeholder="Vijay Nagar, Geeta Bhawan..."
                  value={newAddress.area}
                  onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-dark mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  placeholder="452010"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div>
                <label className="form-label fw-bold text-dark mb-1">Landmark</label>
                <input
                  type="text"
                  placeholder="Near Mall / Bank"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-3">
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn btn-sm btn-light border px-3 rounded-3">Cancel</button>
                <button type="submit" className="btn btn-sm btn-roast px-3 rounded-3 fw-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
