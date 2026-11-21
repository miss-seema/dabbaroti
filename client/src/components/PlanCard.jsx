import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, Calendar, ArrowRight, Sparkles, Clock, Utensils } from 'lucide-react';

export default function PlanCard({ plan, isFeatured = false }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(tomorrow);

  const handleSubscribe = () => {
    addToCart({
      _id: plan._id,
      planId: plan._id,
      name: plan.title,
      title: plan.title,
      type: plan.type,
      itemType: 'plan',
      price: plan.price,
      durationDays: plan.durationDays,
      mealsPerDay: plan.mealsPerDay,
      selectedMeals: plan.includedMeals,
      startDate: startDate,
      quantity: 1,
      image: plan.image
    });
    navigate('/cart');
  };

  return (
    <div className={`card dr-card h-100 ${isFeatured || plan.isPopular ? 'featured' : ''}`}>
      
      {/* Popular/Badge Ribbon */}
      {(plan.badge || plan.isPopular) && (
        <div className="position-absolute top-0 end-0 m-3 z-2 badge rounded-pill bg-terracotta text-white py-2 px-3 fw-bold shadow-sm d-flex align-items-center gap-1">
          <Sparkles size={13} />
          <span>{plan.badge || 'Most Popular'}</span>
        </div>
      )}

      {/* Plan Image Header */}
      <div className="position-relative" style={{ height: '200px', overflow: 'hidden', borderTopLeftRadius: '1.4rem', borderTopRightRadius: '1.4rem' }}>
        <img
          src={plan.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'}
          alt={plan.title}
          className="w-100 h-100 object-fit-cover"
        />
        <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' }}>
          <span className="badge bg-white bg-opacity-25 backdrop-blur-sm text-white text-uppercase px-2 py-1 small fw-bold mb-1">
            {plan.type === 'weekly' ? '7-Day Plan' : '30-Day Monthly Plan'}
          </span>
          <h5 className="font-serif fw-bold text-white mb-0 fs-5">
            {plan.title}
          </h5>
        </div>
      </div>

      {/* Plan Card Body */}
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        
        <div>
          {/* Price Header */}
          <div className="d-flex align-items-baseline gap-2 mb-2">
            <span className="fs-2 fw-black text-roast font-serif">
              ₹{plan.price.toLocaleString()}
            </span>
            <span className="text-muted small fw-semibold">
              / {plan.type === 'weekly' ? 'week' : 'month'}
            </span>
          </div>

          <p className="small text-muted mb-3" style={{ fontSize: '0.825rem', lineHeight: '1.5' }}>
            {plan.description}
          </p>

          {/* Details Badges */}
          <div className="d-flex flex-wrap gap-2 mb-3 pt-2 border-top">
            <span className="badge rounded-pill bg-cream text-roast border fw-bold d-inline-flex align-items-center gap-1 py-1 px-2.5">
              <Utensils size={13} className="text-secondary" />
              {plan.mealsPerDay} {plan.mealsPerDay === 1 ? 'Meal' : 'Meals'} / Day
            </span>
            <span className="badge rounded-pill bg-leaf-light text-leaf border fw-bold d-inline-flex align-items-center gap-1 py-1 px-2.5">
              <Clock size={13} />
              {plan.includedMeals?.join(' + ') || 'Lunch & Dinner'}
            </span>
          </div>

          {/* Inclusions */}
          <div className="mb-4">
            <p className="small fw-bold text-uppercase text-roast mb-2 tracking-wider" style={{ fontSize: '0.7rem' }}>
              Plan Inclusions:
            </p>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {plan.features?.map((feat, idx) => (
                <li key={idx} className="small text-muted d-flex align-items-start gap-2" style={{ fontSize: '0.8rem' }}>
                  <div className="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center flex-shrink-0 mt-1" style={{ width: '16px', height: '16px' }}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Start Date & CTA */}
        <div className="pt-3 border-top mt-auto">
          <div className="mb-3">
            <label className="form-label small fw-bold text-roast mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
              <Calendar size={13} className="text-secondary" />
              Select Start Date:
            </label>
            <input
              type="date"
              min={tomorrow}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control form-control-sm rounded-3 fw-semibold bg-light"
            />
          </div>

          <button
            onClick={handleSubscribe}
            className={`btn w-100 py-2.5 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2 ${
              isFeatured || plan.isPopular
                ? 'btn-terracotta shadow-sm'
                : 'btn-roast'
            }`}
          >
            <span>Subscribe Now</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
