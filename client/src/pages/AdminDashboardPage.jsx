import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  TrendingUp,
  ShoppingBag,
  Calendar,
  Plus,
  Trash2,
  RefreshCw,
  UtensilsCrossed,
  Tag,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [plans, setPlans] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '', type: 'weekly', mealsPerDay: 2, price: 1199, durationDays: 7,
    description: '', features: ['Fresh Hot Rotis', 'Dal + Sabzi + Rice']
  });

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '', category: 'lunch', description: '', price: 140, isVeg: true, calories: 500,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'
  });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountPercent: 10, maxDiscount: 500, minOrderAmount: 1000 });

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, customRes, plansRes, menuRes, couponsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllOrders(),
        api.getAllCustomRequests(),
        api.getPlans(),
        api.getMenu(),
        api.getCoupons()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (ordersRes.success) setOrders(ordersRes.data || []);
      if (customRes.success) setCustomRequests(customRes.data || []);
      if (plansRes.success) setPlans(plansRes.data || []);
      if (menuRes.success) setMenuItems(menuRes.data || []);
      if (couponsRes.success) setCoupons(couponsRes.data || []);
    } catch (err) {
      console.error('Admin data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (res.success) {
        toast.success(`Order status updated to ${newStatus}`);
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Update failed');
    }
  };

  const handleCustomPlanReview = async (requestId, status) => {
    const customPrice = prompt('Enter approved price for this custom plan (or leave current):');
    const adminNotes = prompt('Enter note for the customer (optional):', 'Requirements confirmed by kitchen head.');

    try {
      const res = await api.updateCustomPlanStatus(requestId, {
        status,
        approvedPrice: customPrice ? Number(customPrice) : undefined,
        adminNotes: adminNotes || ''
      });
      if (res.success) {
        toast.success(`Custom plan request ${status}!`);
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createPlan(newPlan);
      if (res.success) {
        toast.success('Plan created successfully');
        setShowPlanModal(false);
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message || 'Plan creation failed');
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      const res = await api.deletePlan(id);
      if (res.success) {
        toast.info('Plan removed');
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateMenuItem = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createMenuItem(newMenuItem);
      if (res.success) {
        toast.success('Menu dish added');
        setShowMenuModal(false);
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await api.deleteMenuItem(id);
      if (res.success) {
        toast.info('Item removed');
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createCoupon(newCoupon);
      if (res.success) {
        toast.success('Coupon code created');
        setShowCouponModal(false);
        loadAllAdminData();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container py-5 font-sans">

      {/* Banner */}
      <div className="card dr-card bg-roast text-white p-4 p-md-5 mb-4 shadow-lg border-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div>
            <span className="badge rounded-pill bg-white bg-opacity-20 text-warning px-3 py-1 fw-bold text-uppercase small mb-2">
              Dabba Roti Administration
            </span>
            <h2 className="font-serif fw-bold text-white mb-1">
              Operations &amp; Subscription Control Center
            </h2>
            <p className="text-white text-opacity-75 small mb-0">
              Real-time management of customer subscriptions, custom plan quotes, kitchens, and deliveries.
            </p>
          </div>

          <button
            onClick={loadAllAdminData}
            className="btn btn-outline-light btn-sm rounded-pill px-3 py-1.5 fw-bold d-flex align-items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? 'spinner-border spinner-border-sm' : ''} />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {[
          { id: 'overview', label: 'Stats Overview', icon: TrendingUp },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'custom_plans', label: `Custom Requests (${customRequests.length})`, icon: ShieldCheck },
          { id: 'plans', label: `Plans (${plans.length})`, icon: Calendar },
          { id: 'menu', label: `Menu Dishes (${menuItems.length})`, icon: UtensilsCrossed },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
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

      {/* 1. Overview */}
      {activeTab === 'overview' && (
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card dr-card p-4">
              <span className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Total Subscribed Revenue</span>
              <div className="fs-2 fw-black text-secondary font-serif mb-1">₹{stats?.totalRevenue?.toLocaleString() || '18,500'}</div>
              <span className="text-success small fw-semibold" style={{ fontSize: '0.75rem' }}>✓ Verified online &amp; COD</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card dr-card p-4">
              <span className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Active Subscriptions</span>
              <div className="fs-2 fw-black text-dark font-serif mb-1">{stats?.activeSubscriptions || 4}</div>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Daily hot tiffins</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card dr-card p-4">
              <span className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Pending Custom Requests</span>
              <div className="fs-2 fw-black text-warning font-serif mb-1">{stats?.pendingCustomRequests || 1}</div>
              <span className="text-warning small fw-semibold" style={{ fontSize: '0.75rem' }}>Requires kitchen review</span>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card dr-card p-4">
              <span className="small text-muted fw-bold text-uppercase mb-1" style={{ fontSize: '0.7rem' }}>Registered Customers</span>
              <div className="fs-2 fw-black text-dark font-serif mb-1">{stats?.totalCustomers || 12}</div>
              <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Mohali central hub</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Orders */}
      {activeTab === 'orders' && (
        <div className="card dr-card overflow-hidden">
          <div className="card-header bg-white p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="font-serif fw-bold text-roast mb-0 fs-6">Customer Orders</h5>
            <span className="badge bg-light text-dark border small">{orders.length} Total</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr className="text-roast fw-bold">
                  <th scope="col" className="py-3 px-3">Order #</th>
                  <th scope="col" className="py-3 px-3">Customer</th>
                  <th scope="col" className="py-3 px-3">Delivery Location</th>
                  <th scope="col" className="py-3 px-3">Total</th>
                  <th scope="col" className="py-3 px-3">Payment</th>
                  <th scope="col" className="py-3 px-3">Status Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td className="py-3 px-3 font-monospace fw-bold text-dark">{ord.orderNumber}</td>
                    <td className="py-3 px-3">
                      <div className="fw-bold text-dark">{ord.deliveryAddress?.name || ord.user?.name || 'Customer'}</div>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{ord.deliveryAddress?.phone || ord.user?.phone}</span>
                    </td>
                    <td className="py-3 px-3 text-muted" style={{ maxWidth: '240px' }}>
                      {ord.deliveryAddress?.street}, {ord.deliveryAddress?.area} ({ord.deliveryAddress?.pincode})
                    </td>
                    <td className="py-3 px-3 fw-bold text-dark">₹{ord.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`badge rounded-pill text-uppercase ${ord.paymentStatus === 'paid' ? 'bg-success bg-opacity-15 text-success' : 'bg-warning bg-opacity-15 text-warning'
                        }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleOrderStatusChange(ord._id, e.target.value)}
                        className="form-select form-select-sm rounded-3 py-1 fw-semibold text-capitalize"
                        style={{ width: '150px' }}
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out For Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Custom Plans Review */}
      {activeTab === 'custom_plans' && (
        <div className="row g-4">
          {customRequests.map((req) => (
            <div key={req._id} className="col-12 col-md-6">
              <div className="card dr-card p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="font-serif fw-bold text-roast mb-0">{req.name}</h5>
                    <span className="text-muted small">{req.email} • {req.phone}</span>
                  </div>
                  <span className={`badge rounded-pill text-uppercase px-2.5 py-1 fw-bold ${req.status === 'approved' ? 'bg-success bg-opacity-15 text-success' : req.status === 'rejected' ? 'bg-danger bg-opacity-15 text-danger' : 'bg-warning bg-opacity-15 text-warning'
                    }`}>
                    {req.status}
                  </span>
                </div>

                <div className="p-3 bg-light rounded-3 small my-3 d-flex flex-column gap-1">
                  <div><strong>Timeline:</strong> {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()} ({req.totalDays} Days)</div>
                  <div><strong>Meals:</strong> {req.mealsPerDay} Meals/Day ({req.selectedMeals?.join(', ')})</div>
                  <div><strong>Diet &amp; Spice:</strong> {req.dietaryType} ({req.spiceLevel} Spice)</div>
                  <div><strong>Quote:</strong> <span className="fw-black text-secondary fs-6 font-serif">₹{(req.approvedPrice || req.estimatedPrice)?.toLocaleString()}</span></div>
                </div>

                {req.specialInstructions && (
                  <p className="small text-muted fst-italic mb-3">"{req.specialInstructions}"</p>
                )}

                <div className="d-flex gap-2">
                  <button
                    onClick={() => handleCustomPlanReview(req._id, 'approved')}
                    className="btn btn-sm btn-success flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-1"
                  >
                    <CheckCircle size={14} />
                    <span>Approve &amp; Set Price</span>
                  </button>
                  <button
                    onClick={() => handleCustomPlanReview(req._id, 'rejected')}
                    className="btn btn-sm btn-outline-danger rounded-3"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Plans */}
      {activeTab === 'plans' && (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="font-serif fw-bold text-roast mb-0">Tiffin Plans</h5>
            <button onClick={() => setShowPlanModal(true)} className="btn btn-sm btn-roast rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
              <Plus size={14} />
              <span>Add Plan</span>
            </button>
          </div>

          <div className="row g-4">
            {plans.map((p) => (
              <div key={p._id} className="col-12 col-md-6 col-lg-3">
                <div className="card dr-card p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge rounded-pill bg-cream text-roast border small fw-bold text-uppercase mb-2">
                      {p.type} ({p.durationDays} Days)
                    </span>
                    <h5 className="font-serif fw-bold text-roast mb-1">{p.title}</h5>
                    <div className="fs-3 fw-black text-secondary font-serif mb-2">₹{p.price?.toLocaleString()}</div>
                    <p className="small text-muted mb-0">{p.description}</p>
                  </div>
                  <div className="pt-3 border-top mt-3 text-end">
                    <button onClick={() => handleDeletePlan(p._id)} className="btn btn-sm btn-link text-danger p-0" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Menu */}
      {activeTab === 'menu' && (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="font-serif fw-bold text-roast mb-0">Kitchen Menu Catalog</h5>
            <button onClick={() => setShowMenuModal(true)} className="btn btn-sm btn-roast rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
              <Plus size={14} />
              <span>Add Menu Dish</span>
            </button>
          </div>

          <div className="row g-3">
            {menuItems.map((m) => (
              <div key={m._id} className="col-12 col-md-4">
                <div className="card dr-card p-3 d-flex flex-row align-items-center gap-3">
                  <img src={m.image} alt={m.name} className="rounded-3 object-fit-cover flex-shrink-0" style={{ width: '64px', height: '64px' }} />
                  <div className="flex-grow-1 min-w-0">
                    <span className="small text-muted text-uppercase fw-bold d-block" style={{ fontSize: '0.65rem' }}>{m.category}</span>
                    <h6 className="fw-bold text-dark mb-0 small text-truncate">{m.name}</h6>
                    <span className="fw-bold text-secondary font-serif">₹{m.price}</span>
                  </div>
                  <button onClick={() => handleDeleteMenuItem(m._id)} className="btn btn-link text-muted hover-danger p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Coupons */}
      {activeTab === 'coupons' && (
        <div className="d-flex flex-column gap-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="font-serif fw-bold text-roast mb-0">Active Coupons</h5>
            <button onClick={() => setShowCouponModal(true)} className="btn btn-sm btn-roast rounded-pill px-3 fw-bold d-flex align-items-center gap-1">
              <Plus size={14} />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="row g-3">
            {coupons.map((c) => (
              <div key={c._id} className="col-12 col-sm-4">
                <div className="card dr-card p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="font-monospace fw-bold fs-6 text-secondary">{c.code}</span>
                    <span className="badge bg-success bg-opacity-15 text-success">{c.discountPercent}% OFF</span>
                  </div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Min Order: ₹{c.minOrderAmount} • Max: ₹{c.maxDiscount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card dr-card p-4 w-100" style={{ maxWidth: '440px' }}>
            <h5 className="font-serif fw-bold text-roast mb-3">Add Tiffin Plan</h5>
            <form onSubmit={handleCreatePlan} className="d-flex flex-column gap-2 small">
              <div>
                <label className="form-label fw-bold text-dark mb-1">Plan Title</label>
                <input
                  type="text"
                  required
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="Monthly 2-Meal (₹3,500)"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label fw-bold text-dark mb-1">Type</label>
                  <select
                    value={newPlan.type}
                    onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                    className="form-select form-select-sm rounded-3 bg-light"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-dark mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
              </div>
              <div>
                <label className="form-label fw-bold text-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-3">
                <button type="button" onClick={() => setShowPlanModal(false)} className="btn btn-sm btn-light border px-3 rounded-3">Cancel</button>
                <button type="submit" className="btn btn-sm btn-roast px-3 rounded-3 fw-bold">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Modal */}
      {showMenuModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-3 p-3" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="card dr-card p-4 w-100" style={{ maxWidth: '440px' }}>
            <h5 className="font-serif fw-bold text-roast mb-3">Add Kitchen Dish</h5>
            <form onSubmit={handleCreateMenuItem} className="d-flex flex-column gap-2 small">
              <div>
                <label className="form-label fw-bold text-dark mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                  placeholder="Royal Shahi Paneer Thali"
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="row g-2">
                <div className="col-6">
                  <label className="form-label fw-bold text-dark mb-1">Category</label>
                  <select
                    value={newMenuItem.category}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                    className="form-select form-select-sm rounded-3 bg-light"
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="addon">Add-On</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold text-dark mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newMenuItem.price}
                    onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
              </div>
              <div>
                <label className="form-label fw-bold text-dark mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                  className="form-control form-control-sm rounded-3 bg-light"
                />
              </div>
              <div className="d-flex justify-content-end gap-2 pt-3">
                <button type="button" onClick={() => setShowMenuModal(false)} className="btn btn-sm btn-light border px-3 rounded-3">Cancel</button>
                <button type="submit" className="btn btn-sm btn-roast px-3 rounded-3 fw-bold">Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
