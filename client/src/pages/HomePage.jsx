import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import PlanCard from '../components/PlanCard';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Quote,
  ChevronRight,
  UtensilsCrossed
} from 'lucide-react';

export default function HomePage() {
  const [plans, setPlans] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, reviewsRes] = await Promise.all([
          api.getPlans(),
          api.getReviews()
        ]);
        if (plansRes.success) setPlans(plansRes.data || []);
        if (reviewsRes.success) setReviews(reviewsRes.data || []);
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="font-sans">

      {/* 1. HERO SECTION */}
      <section className="py-5 py-lg-6 position-relative overflow-hidden">
        <div className="container">
          <div className="row align-items-center g-5">

            {/* Left Hero Content */}
            <div className="col-12 col-lg-7 text-center text-lg-start">

              {/* Logo Badge & Pill */}
              <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-3 mb-4">
                {/* <div className="logo-badge" style={{ width: '56px', height: '56px' }}>
                  <img src="/logo.jpg" alt="Dabba Roti Logo" />
                </div> */}
                <div>
                  <div className="badge rounded-pill bg-cream text-roast border px-3 py-2 fw-bold d-inline-flex align-items-center gap-2">
                    <Sparkles size={14} className="text-secondary" />
                    <span>Mohali's Premier Daily Home Tiffin Service</span>
                  </div>
                  {/* <div className="small text-muted fw-bold text-uppercase mt-1" style={{ fontSize: '0.65rem' }}>
                    Desi Food • Freshly Packed
                  </div> */}
                </div>
              </div>

              <h1 className="font-serif display-4 fw-black text-roast lh-sm mb-3">
                Fresh, Pure &amp; Wholesome Meals. <br />
                <span className="text-terracotta fst-italic">
                  A Taste You'll Keep Coming Back For!
                </span>
              </h1>

              <p className="lead text-muted fs-6 mb-4 col-lg-11 mx-auto mx-lg-0" style={{ lineHeight: '1.7' }}>
                Craving the comforting warmth of mom’s hand-made rotis and slow-simmered dal? Dabba Roti brings 100% home-style, hygienic, and nutritious daily meal subscriptions directly to your home or office.
              </p>

              {/* USP Checklist */}
              <div className="row g-2 mb-4 justify-content-center justify-content-lg-start">
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-2 small fw-bold text-dark">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>100% Whole Wheat Rotis</span>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-2 small fw-bold text-dark">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Pure Cow Desi Ghee</span>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="d-flex align-items-center gap-2 small fw-bold text-dark">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Zero Preservatives</span>
                  </div>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center justify-content-lg-start gap-3 mb-5">
                <Link to="/plans" className="btn btn-roast btn-lg rounded-4 px-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto">
                  <span>Order Now</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/custom-plan" className="btn btn-outline-roast btn-lg rounded-4 px-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 w-100 w-sm-auto">
                  <Sparkles size={18} className="text-secondary" />
                  <span>Build Custom Plan</span>
                </Link>
              </div>

              {/* Social Proof Counter */}
              <div className="pt-4 border-top d-flex align-items-center justify-content-center justify-content-lg-start gap-4 text-muted small">
                <div>
                  <div className="fs-3 fw-black text-roast font-serif lh-1">4,500+</div>
                  <span className="small text-muted">Daily Patrons</span>
                </div>
                <div className="vr opacity-25"></div>
                <div>
                  <div className="fs-3 fw-black text-roast font-serif lh-1">4.9 ★</div>
                  <span className="small text-muted">Rating</span>
                </div>
                <div className="vr opacity-25"></div>
                <div>
                  <div className="fs-3 fw-black text-roast font-serif lh-1">100%</div>
                  <span className="small text-muted">Fresh Daily</span>
                </div>
              </div>

            </div>

            {/* Right Hero Visual Cards */}
            <div className="col-12 col-lg-5">
              <div className="position-relative mx-auto" style={{ maxWidth: '440px' }}>

                {/* Main Food Photo */}
                <div className="card dr-card overflow-hidden shadow-lg border-4 border-white position-relative" style={{ height: '500px' }}>
                  {/* Floating Circular Badge */}
                  <div className="position-absolute top-0 end-0 m-3 z-2 logo-badge shadow-lg" style={{ width: '64px', height: '64px', borderWidth: '3px' }}>
                    <img src="/logo.jpg" alt="Dabba Roti Seal" />
                  </div>

                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80"
                    alt="Authentic Dabba Roti Home Style Thali Tiffin"
                    className="w-100 h-100 object-fit-cover"
                  />

                  <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }}>
                    <span className="badge bg-terracotta text-white fw-bold mb-2 text-uppercase">
                      Today's Kitchen Special
                    </span>
                    <h4 className="font-serif fw-bold text-white mb-1">
                      Desi Ghee Phulkas &amp; Shahi Paneer Thali
                    </h4>
                    <p className="small text-white text-opacity-75 mb-0">
                      4 Soft Rotis, Yellow Dal Tadka, Seasonal Sabzi &amp; Jeera Rice
                    </p>
                  </div>
                </div>

                {/* Floating Monthly Plan Tag */}
                <div className="position-absolute bottom-0 start-0 translate-middle-y ms-n3 mb-n4 bg-white p-3 rounded-4 shadow-lg border d-flex align-items-center gap-3" style={{ maxWidth: '280px' }}>
                  <div className="rounded-3 bg-cream text-roast fs-4 fw-black font-serif d-flex align-items-center justify-content-center p-3 flex-shrink-0" style={{ width: '56px', height: '56px' }}>
                    ₹3.5k
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0 small">Monthly 2-Meal Plan</h6>
                    <span className="text-muted small d-block" style={{ fontSize: '0.75rem' }}>Lunch + Dinner • ₹3,500/mo</span>
                    <span className="text-secondary fw-bold small" style={{ fontSize: '0.75rem' }}>Just ₹58 per hot meal!</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
              Seamless Daily Experience
            </span>
            <h2 className="font-serif fw-bold text-roast fs-2">
              How Dabba Roti Works
            </h2>
            <p className="text-muted small mb-0">
              Enjoying pure home-cooked meals every day is as simple as 1, 2, 3.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 p-4 text-center bg-cream-card border-0">
                <div className="rounded-4 bg-roast text-white fs-3 fw-bold font-serif d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
                  1
                </div>
                <h5 className="font-serif fw-bold text-roast mb-2">Choose Your Plan</h5>
                <p className="text-muted small mb-0">
                  Pick from flexible Weekly or Monthly subscriptions (2 or 3 meals/day), or craft your personalized custom diet.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 p-4 text-center bg-cream-card border-0">
                <div className="rounded-4 bg-terracotta text-white fs-3 fw-bold font-serif d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
                  2
                </div>
                <h5 className="font-serif fw-bold text-roast mb-2">Select Dates &amp; Slots</h5>
                <p className="text-muted small mb-0">
                  Choose your start date, meal delivery windows (breakfast, lunch, dinner), and special spice or dietary preferences.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 p-4 text-center bg-cream-card border-0">
                <div className="rounded-4 bg-leaf text-white fs-3 fw-bold font-serif d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '64px', height: '64px' }}>
                  3
                </div>
                <h5 className="font-serif fw-bold text-roast mb-2">Hot Doorstep Delivery</h5>
                <p className="text-muted small mb-0">
                  Our courteous delivery fleet brings piping hot, untouched food boxes directly to your home or desk right on time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR TIFFIN PLANS SHOWCASE */}
      <section className="py-5">
        <div className="container py-4">
          <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between mb-5 gap-3">
            <div>
              <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
                Affordable Daily Dining
              </span>
              <h2 className="font-serif fw-bold text-roast fs-2 mb-1">
                Popular Subscription Plans
              </h2>
              <p className="text-muted small mb-0">
                Choose a weekly or monthly subscription with free pause and resume flexibility.
              </p>
            </div>
            <Link to="/plans" className="btn btn-outline-roast fw-bold small rounded-3 d-inline-flex align-items-center gap-2">
              <span>View All Plans &amp; Pricing</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className="card dr-card placeholder-glow" style={{ height: '480px' }}></div>
                </div>
              ))
            ) : (
              plans.slice(0, 3).map((plan) => (
                <div key={plan._id} className="col-12 col-md-6 col-lg-4">
                  <PlanCard plan={plan} isFeatured={plan.isPopular} />
                </div>
              ))
            )}
          </div>

          {/* Custom Plan Callout Banner */}
          <div className="card dr-card bg-roast text-white rounded-4 p-4 p-md-5 mt-5 border-0 shadow-lg">
            <div className="row align-items-center g-4">
              <div className="col-12 col-lg-8 text-center text-lg-start">
                <span className="badge rounded-pill bg-white bg-opacity-20 text-warning px-3 py-1 fw-bold text-uppercase small mb-2">
                  Tailored Daily Schedule
                </span>
                <h3 className="font-serif fw-bold text-white fs-2 mb-2">
                  Need a Custom Meal Schedule or Special Diet?
                </h3>
                <p className="text-white text-opacity-75 small mb-0" style={{ maxWidth: '620px' }}>
                  Choose specific days (e.g. Mon–Fri only), Jain meals (no onion-garlic), high protein diets, or custom breakfast/dinner pairings with live dynamic pricing!
                </p>
              </div>
              <div className="col-12 col-lg-4 text-center text-lg-end">
                <Link to="/custom-plan" className="btn btn-terracotta btn-lg rounded-4 px-4 py-3 fw-bold d-inline-flex align-items-center gap-2">
                  <span>Build Custom Plan</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TODAY'S ROTATIONAL MENU PREVIEW */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
              Rotational Daily Menu
            </span>
            <h2 className="font-serif fw-bold text-roast fs-2">
              What's Cooking Today?
            </h2>
            <p className="text-muted small mb-0">
              Every day brings a fresh variety of North Indian dishes prepared with love.
            </p>
          </div>

          <div className="row g-4">

            {/* Breakfast */}
            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 overflow-hidden">
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80"
                    alt="Breakfast"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-2">
                      Breakfast (7:30 - 8:30 AM)
                    </span>
                    <h5 className="font-serif fw-bold text-roast mb-1">Indori Poha with Sev &amp; Jalebi</h5>
                    <p className="small text-muted mb-0">Steamed flattened rice cooked with fennel, mustard seeds and crunchy sev.</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3 small">
                    <span className="fw-bold text-dark">280 kcal</span>
                    <Link to="/menu" className="fw-bold text-secondary text-decoration-none">View Menu →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Lunch */}
            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 overflow-hidden">
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80"
                    alt="Lunch"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-2">
                      Lunch (12:00 - 1:30 PM)
                    </span>
                    <h5 className="font-serif fw-bold text-roast mb-1">Shahi Paneer &amp; Dal Tadka Thali</h5>
                    <p className="small text-muted mb-0">4 Phulkas with pure ghee, cottage cheese curry, yellow dal tadka &amp; jeera rice.</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3 small">
                    <span className="fw-bold text-dark">580 kcal</span>
                    <Link to="/menu" className="fw-bold text-secondary text-decoration-none">View Menu →</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Dinner */}
            <div className="col-12 col-md-4">
              <div className="card dr-card h-100 overflow-hidden">
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img
                    src="https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80"
                    alt="Dinner"
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
                <div className="card-body p-4 d-flex flex-column justify-content-between">
                  <div>
                    <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-2">
                      Dinner (7:30 - 9:00 PM)
                    </span>
                    <h5 className="font-serif fw-bold text-roast mb-1">Palak Corn &amp; Panchmel Dal Box</h5>
                    <p className="small text-muted mb-0">Creamy spinach corn gravy, five-lentil light dal, 4 rotis and vegetable pulao.</p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-3 small">
                    <span className="fw-bold text-dark">460 kcal</span>
                    <Link to="/menu" className="fw-bold text-secondary text-decoration-none">View Menu →</Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CUSTOMER TESTIMONIALS */}
      <section className="py-5" id="testimonials">
        <div className="container py-4">
          <div className="text-center max-w-xl mx-auto mb-5">
            <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
              Real Customer Stories
            </span>
            <h2 className="font-serif fw-bold text-roast fs-2">
              Why Customers Love Dabba Roti
            </h2>
            <p className="text-muted small mb-0">
              Read reviews from professionals, students, and families across Mohali.
            </p>
          </div>

          <div className="row g-4">
            {reviews.map((rev) => (
              <div key={rev._id} className="col-12 col-md-4">
                <div className="card dr-card h-100 p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex align-items-center gap-1 text-warning mb-3">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="#D97706" />
                      ))}
                    </div>
                    <Quote size={28} className="text-muted text-opacity-25 mb-2" />
                    <p className="small text-dark fst-italic leading-relaxed mb-4">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-3 pt-3 border-top mt-auto">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt={rev.name}
                      className="rounded-circle border"
                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold text-roast mb-0 small">{rev.name}</h6>
                      <span className="text-secondary small fw-semibold" style={{ fontSize: '0.75rem' }}>{rev.planName}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-5">
        <div className="container">
          <div className="card dr-card bg-terracotta text-white rounded-4 p-5 text-center shadow-lg border-0">
            <div className="col-lg-8 mx-auto">
              <h2 className="font-serif display-5 fw-black text-white mb-3">
                Ready for Wholesome Home Meals Every Day?
              </h2>
              <p className="lead text-white text-opacity-85 fs-6 mb-4">
                Join thousands of happy eaters who never worry about what to cook or eat. Select your plan now and get your first hot dabba delivered tomorrow!
              </p>
              <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-3">
                <Link to="/plans" className="btn btn-roast btn-lg rounded-4 px-4 py-3 fw-bold w-100 w-sm-auto">
                  Explore Tiffin Plans
                </Link>
                <Link to="/custom-plan" className="btn btn-outline-light btn-lg rounded-4 px-4 py-3 fw-bold w-100 w-sm-auto">
                  Customize Your Own Meal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
