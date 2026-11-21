import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Check,
  Plus,
  Minus,
  Sparkles,
  Send,
  ShieldCheck
} from 'lucide-react';

export default function CustomPlanPage() {
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const nextMonth = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(nextMonth);
  const [selectedMeals, setSelectedMeals] = useState(['lunch', 'dinner']);
  const [selectedDaysOption, setSelectedDaysOption] = useState('all'); // 'all', 'weekdays', 'custom'
  const [customDays, setCustomDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [dietaryType, setDietaryType] = useState('Veg');
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [availableAddOns] = useState([
    { id: 'extra_roti', name: 'Extra Ghee Phulkas (3 pcs)', price: 30, quantity: 0 },
    { id: 'chaas', name: 'Spiced Buttermilk (Masala Chaas)', price: 25, quantity: 0 },
    { id: 'sweet', name: 'Hot Gulab Jamun (2 pcs)', price: 40, quantity: 0 },
    { id: 'raita', name: 'Boondi / Veggie Curd Raita', price: 30, quantity: 0 },
    { id: 'salad', name: 'Fresh Green Sprouted Salad', price: 25, quantity: 0 }
  ]);
  const [addOns, setAddOns] = useState(availableAddOns);

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.addresses?.[0]?.street || '',
    area: user?.addresses?.[0]?.area || '',
    city: user?.addresses?.[0]?.city || 'Mohali',
    pincode: user?.addresses?.[0]?.pincode || '',
    landmark: user?.addresses?.[0]?.landmark || ''
  });

  const [quote, setQuote] = useState({
    activeDaysCount: 30,
    mealRatePerDay: 140,
    baseMealTotal: 4200,
    addOnsTotal: 0,
    discount: 630,
    finalEstimatedPrice: 3570
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        let activeDays = ['All Days'];
        if (selectedDaysOption === 'weekdays') {
          activeDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        } else if (selectedDaysOption === 'custom') {
          activeDays = customDays;
        }

        const activeAddons = addOns
          .filter((a) => a.quantity > 0)
          .map((a) => ({ name: a.name, price: a.price, quantity: a.quantity }));

        const res = await api.calculateCustomPlan({
          startDate,
          endDate,
          selectedMeals,
          selectedDays: activeDays,
          addOns: activeAddons
        });

        if (res.success && res.calculation) {
          setQuote(res.calculation);
        }
      } catch (err) {
        console.error('Calculation error:', err);
      }
    };

    fetchCalculation();
  }, [startDate, endDate, selectedMeals, selectedDaysOption, customDays, addOns]);

  const handleMealToggle = (meal) => {
    if (selectedMeals.includes(meal)) {
      if (selectedMeals.length === 1) {
        toast.error('You must select at least one meal category');
        return;
      }
      setSelectedMeals(selectedMeals.filter((m) => m !== meal));
    } else {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const handleDayToggle = (day) => {
    if (customDays.includes(day)) {
      if (customDays.length === 1) {
        toast.error('Please select at least one day');
        return;
      }
      setCustomDays(customDays.filter((d) => d !== day));
    } else {
      setCustomDays([...customDays, day]);
    }
  };

  const handleAddonQty = (id, delta) => {
    setAddOns((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please log in to submit your custom subscription request');
      navigate('/login', { state: { from: '/custom-plan' } });
      return;
    }

    if (!deliveryAddress.street || !deliveryAddress.pincode) {
      toast.error('Please provide your complete delivery street and pincode');
      return;
    }

    setSubmitting(true);
    try {
      let activeDays = ['All Days'];
      if (selectedDaysOption === 'weekdays') {
        activeDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      } else if (selectedDaysOption === 'custom') {
        activeDays = customDays;
      }

      const activeAddons = addOns
        .filter((a) => a.quantity > 0)
        .map((a) => ({ name: a.name, price: a.price, quantity: a.quantity }));

      const res = await api.submitCustomPlanRequest({
        name: user.name,
        email: user.email,
        phone: user.phone,
        startDate,
        endDate,
        mealsPerDay: selectedMeals.length,
        selectedMeals,
        selectedDays: activeDays,
        dietaryType,
        spiceLevel,
        addOns: activeAddons,
        specialInstructions,
        deliveryAddress
      });

      if (res.success) {
        setSubmittedSuccess(true);
        toast.success('Your custom plan request has been submitted for kitchen confirmation!');
      }
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: '640px' }}>
        <div className="rounded-circle bg-success bg-opacity-15 text-success d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
          <Check size={40} strokeWidth={3} />
        </div>

        <h2 className="font-serif fw-bold text-roast fs-2 mb-2">
          Custom Plan Request Received!
        </h2>

        <p className="text-muted small leading-relaxed mb-4">
          Thank you, <strong className="text-dark">{user?.name}</strong>. Our kitchen manager has received your tailored schedule. We will confirm your dietary preferences and activate your plan.
        </p>

        <div className="card dr-card p-4 text-start mb-4">
          <div className="d-flex justify-content-between py-1 border-bottom small">
            <span className="text-muted">Duration:</span>
            <span className="fw-bold text-dark">{quote.activeDaysCount} Days ({startDate} to {endDate})</span>
          </div>
          <div className="d-flex justify-content-between py-1 border-bottom small">
            <span className="text-muted">Selected Meals:</span>
            <span className="fw-bold text-dark text-capitalize">{selectedMeals.join(', ')}</span>
          </div>
          <div className="d-flex justify-content-between py-1 border-bottom small">
            <span className="text-muted">Diet Preference:</span>
            <span className="fw-bold text-dark">{dietaryType} ({spiceLevel} Spice)</span>
          </div>
          <div className="d-flex justify-content-between pt-2 fs-6">
            <span className="fw-bold text-dark">Estimated Total:</span>
            <span className="fw-black text-secondary font-serif">₹{quote.finalEstimatedPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="btn btn-roast px-4 py-2.5 rounded-3 fw-bold small">
            View in Customer Dashboard
          </button>
          <button onClick={() => setSubmittedSuccess(false)} className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold small">
            Create Another Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 font-sans">

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-5">
        <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
          Personalized Dining
        </span>
        <h1 className="font-serif display-5 fw-black text-roast mb-2">
          Custom Tiffin Plan Builder
        </h1>
        <p className="text-muted small mb-0 col-lg-8 mx-auto leading-relaxed">
          Select your dates, preferred meal categories, delivery days, and dietary preferences. Watch your estimated subscription price calculate in real-time!
        </p>
      </div>

      <div className="row g-5">

        {/* Left Form */}
        <div className="col-12 col-lg-8">
          <div className="card dr-card p-4 p-md-5">

            {/* Step 1: Dates */}
            <div className="mb-4">
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">1</span>
                <span>Select Start Date &amp; End Date</span>
              </h5>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">Start Date</label>
                  <input
                    type="date"
                    min={tomorrow}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control rounded-3 fw-semibold bg-light"
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">End Date</label>
                  <input
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control rounded-3 fw-semibold bg-light"
                  />
                </div>
              </div>
              <span className="text-muted small fst-italic mt-2 d-block" style={{ fontSize: '0.75rem' }}>
                * Long subscriptions (28+ days) receive an automatic 15% volume discount!
              </span>
            </div>

            <hr className="my-4 opacity-10" />

            {/* Step 2: Meals */}
            <div className="mb-4">
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">2</span>
                <span>Select Meals Per Day</span>
              </h5>

              <div className="row g-3">
                {[
                  { id: 'breakfast', label: 'Breakfast', time: '7:30 - 8:30 AM', rate: '₹45/day' },
                  { id: 'lunch', label: 'Lunch', time: '12:00 - 1:30 PM', rate: '₹70/day' },
                  { id: 'dinner', label: 'Dinner', time: '7:30 - 9:00 PM', rate: '₹70/day' }
                ].map((m) => {
                  const isChecked = selectedMeals.includes(m.id);
                  return (
                    <div key={m.id} className="col-12 col-sm-4">
                      <div
                        onClick={() => handleMealToggle(m.id)}
                        className={`card dr-card p-3 h-100 cursor-pointer text-start ${isChecked ? 'border-2 border-secondary bg-cream' : 'border'
                          }`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="fw-bold text-dark small">{m.label}</span>
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${isChecked ? 'bg-secondary text-white' : 'border'}`} style={{ width: '20px', height: '20px' }}>
                            {isChecked && <Check size={13} strokeWidth={3} />}
                          </div>
                        </div>
                        <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>{m.time}</span>
                        <span className="text-secondary fw-bold small mt-1">{m.rate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            {/* Step 3: Days */}
            <div className="mb-4">
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">3</span>
                <span>Required Meal Days</span>
              </h5>

              <div className="d-flex flex-wrap gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedDaysOption('all')}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${selectedDaysOption === 'all' ? 'btn-roast' : 'btn-light border text-dark'
                    }`}
                >
                  All 7 Days (Mon–Sun)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDaysOption('weekdays')}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${selectedDaysOption === 'weekdays' ? 'btn-roast' : 'btn-light border text-dark'
                    }`}
                >
                  Weekdays Only (Mon–Fri)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDaysOption('custom')}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold ${selectedDaysOption === 'custom' ? 'btn-terracotta' : 'btn-light border text-dark'
                    }`}
                >
                  Pick Specific Days
                </button>
              </div>

              {selectedDaysOption === 'custom' && (
                <div className="d-flex flex-wrap gap-1.5 pt-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                    const isDaySelected = customDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`btn btn-sm rounded-3 py-1 px-2.5 small fw-bold ${isDaySelected ? 'btn-roast' : 'btn-light border text-muted'
                          }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <hr className="my-4 opacity-10" />

            {/* Step 4: Diet */}
            <div className="mb-4">
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">4</span>
                <span>Dietary Preference &amp; Spice Level</span>
              </h5>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">Diet Type</label>
                  <select
                    value={dietaryType}
                    onChange={(e) => setDietaryType(e.target.value)}
                    className="form-select rounded-3 fw-semibold bg-light"
                  >
                    <option value="Veg">Standard Vegetarian (Pure Veg)</option>
                    <option value="Jain">Jain (No Onion, No Garlic, No Root Veg)</option>
                    <option value="Swaminarayan">Swaminarayan (No Onion, No Garlic)</option>
                    <option value="Eggitarian">Eggitarian (Veg + Boiled Eggs)</option>
                  </select>
                </div>

                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">Spice Level</label>
                  <select
                    value={spiceLevel}
                    onChange={(e) => setSpiceLevel(e.target.value)}
                    className="form-select rounded-3 fw-semibold bg-light"
                  >
                    <option value="Mild">Mild (Low Chili &amp; Low Masala)</option>
                    <option value="Medium">Medium (Homestyle Balanced)</option>
                    <option value="Spicy">Spicy (Indori Zesty)</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            {/* Step 5: Add-ons */}
            <div className="mb-4">
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">5</span>
                <span>Optional Daily Add-Ons</span>
              </h5>

              <div className="d-flex flex-column gap-2">
                {addOns.map((addon) => (
                  <div key={addon.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                    <div>
                      <h6 className="fw-bold text-dark mb-0 small">{addon.name}</h6>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>₹{addon.price} per day</span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddonQty(addon.id, -1)}
                        disabled={addon.quantity === 0}
                        className="btn btn-sm btn-white border rounded-2 p-1"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="fw-bold small text-dark px-2">{addon.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleAddonQty(addon.id, 1)}
                        className="btn btn-sm btn-roast rounded-2 p-1 text-white"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-4 opacity-10" />

            {/* Step 6: Instructions & Address */}
            <div>
              <h5 className="font-serif fw-bold text-roast mb-3 d-flex align-items-center gap-2">
                <span className="badge rounded-pill bg-cream text-roast border">6</span>
                <span>Special Instructions &amp; Delivery Address</span>
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-dark mb-1">Cooking Instructions</label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="E.g., Very low oil, diabetic-friendly, less salt in dal..."
                  className="form-control rounded-3 small bg-light"
                />
              </div>

              <div className="row g-2">
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    placeholder="Flat/House No., Street"
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-dark mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    value={deliveryAddress.area}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, area: e.target.value })}
                    placeholder="Vijay Nagar, Geeta Bhawan..."
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-dark mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    placeholder="452010"
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-dark mb-1">Landmark</label>
                  <input
                    type="text"
                    value={deliveryAddress.landmark}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                    placeholder="Near Mall / Bank"
                    className="form-control form-control-sm rounded-3 bg-light"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sticky Summary */}
        <div className="col-12 col-lg-4">
          <div className="card dr-card p-4 p-md-4 sticky-top shadow-lg" style={{ top: '100px' }}>
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
              <div>
                <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-1">
                  Live Dynamic Quote
                </span>
                <h5 className="font-serif fw-bold text-roast mb-0">Custom Summary</h5>
              </div>
              <Sparkles size={20} className="text-secondary" />
            </div>

            <div className="d-flex flex-column gap-2 small text-muted mb-4">
              <div className="d-flex justify-content-between">
                <span>Active Delivery Days:</span>
                <strong className="text-dark">{quote.activeDaysCount} Days</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Selected Meals:</span>
                <strong className="text-dark text-capitalize">{selectedMeals.join(' + ')}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Base Meal Total:</span>
                <strong className="text-dark">₹{quote.baseMealTotal.toLocaleString()}</strong>
              </div>
              {quote.addOnsTotal > 0 && (
                <div className="d-flex justify-content-between">
                  <span>Add-Ons Total:</span>
                  <strong className="text-dark">+₹{quote.addOnsTotal.toLocaleString()}</strong>
                </div>
              )}
              {quote.discount > 0 && (
                <div className="d-flex justify-content-between text-success fw-bold">
                  <span>Volume Plan Discount:</span>
                  <span>-₹{quote.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-baseline pt-3 border-top mt-2">
                <div>
                  <span className="fw-bold text-dark fs-6 d-block">Estimated Total:</span>
                  <span className="text-muted small" style={{ fontSize: '0.7rem' }}>Delivery &amp; Taxes Included</span>
                </div>
                <span className="fs-2 fw-black text-secondary font-serif">
                  ₹{quote.finalEstimatedPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-3 bg-cream mb-4 border small">
              <div className="d-flex align-items-center gap-1 fw-bold text-roast mb-1" style={{ fontSize: '0.75rem' }}>
                <ShieldCheck size={14} className="text-secondary" />
                <span>Kitchen Review Workflow</span>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.4' }}>
                Upon submission, our kitchen chef will verify your custom requests and confirm your schedule.
              </p>
            </div>

            <button
              onClick={handleSubmitRequest}
              disabled={submitting}
              className="btn btn-terracotta w-100 py-3 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2"
            >
              {submitting ? (
                <span>Submitting Request...</span>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Custom Plan Request</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
