import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import PlanCard from '../components/PlanCard';
import {
  CheckCircle2,
  ArrowRight,
  Sliders
} from 'lucide-react';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'weekly', 'monthly'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.getPlans();
        if (res.success) {
          setPlans(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const weeklyPlans = plans.filter((p) => p.type === 'weekly');
  const monthlyPlans = plans.filter((p) => p.type === 'monthly');

  const displayedPlans =
    activeTab === 'weekly'
      ? weeklyPlans
      : activeTab === 'monthly'
      ? monthlyPlans
      : plans;

  return (
    <div className="font-sans py-5">
      
      {/* Page Header */}
      <section className="text-center py-5 bg-white border-bottom mb-5">
        <div className="container">
          <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
            Dabba Roti Subscriptions
          </span>
          <h1 className="font-serif display-4 fw-black text-roast mb-2">
            Choose Your Daily Tiffin Plan
          </h1>
          <p className="font-serif fst-italic text-secondary fs-5 fw-bold mb-3">
            "A Taste You'll Keep Coming Back For!"
          </p>
          <p className="lead text-muted fs-6 col-lg-8 mx-auto mb-4" style={{ lineHeight: '1.7' }}>
            Transparent pricing, fresh homestyle cooking, pure desi cow ghee, and zero delivery surcharges on all monthly subscriptions.
          </p>

          {/* Filter Pills */}
          <div className="d-flex items-center justify-content-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold ${
                activeTab === 'all' ? 'btn-roast' : 'btn-light border text-dark'
              }`}
            >
              All Plans ({plans.length})
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold ${
                activeTab === 'weekly' ? 'btn-roast' : 'btn-light border text-dark'
              }`}
            >
              Weekly (7 Days)
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`btn btn-sm rounded-pill px-4 py-2 fw-bold ${
                activeTab === 'monthly' ? 'btn-roast' : 'btn-light border text-dark'
              }`}
            >
              Monthly (30 Days) • Best Value
            </button>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mb-5">
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="col-12 col-md-4">
                <div className="card dr-card placeholder-glow" style={{ height: '480px' }}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row g-4">
            {displayedPlans.map((plan) => (
              <div key={plan._id} className="col-12 col-md-6 col-lg-4">
                <PlanCard plan={plan} isFeatured={plan.isPopular} />
              </div>
            ))}

            {/* Custom Plan Interactive Tile */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card dr-card h-100 p-4 d-flex flex-column justify-content-between bg-cream-card border-2 border-dashed border-secondary">
                <div>
                  <div className="rounded-4 bg-roast text-white p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
                    <Sliders size={24} />
                  </div>
                  <div>
                    <span className="badge rounded-pill bg-cream text-roast border small fw-bold mb-2">
                      Fully Flexible
                    </span>
                    <h4 className="font-serif fw-bold text-roast mb-2">
                      Build a Custom Plan
                    </h4>
                    <p className="text-muted small leading-relaxed mb-4">
                      Want 5 days a week? Jain preparation? Extra rotis or daily chaas? Design your exact dream meal schedule with live pricing.
                    </p>
                  </div>

                  <ul className="list-unstyled d-flex flex-column gap-2 small text-dark mb-4">
                    <li className="d-flex align-items-center gap-2">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>Choose custom start &amp; end dates</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>Select Mon–Fri or custom days</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <CheckCircle2 size={16} className="text-success" />
                      <span>Instant dynamic quote calculation</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-top">
                  <Link
                    to="/custom-plan"
                    className="btn btn-terracotta w-100 py-2.5 rounded-3 fw-bold small d-flex align-items-center justify-content-center gap-2"
                  >
                    <span>Open Custom Plan Builder</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </section>

      {/* Plan Inclusions Table */}
      <section className="container mb-5">
        <div className="card dr-card p-4 p-md-5">
          <div className="text-center max-w-xl mx-auto mb-4">
            <h3 className="font-serif fw-bold text-roast fs-3 mb-1">
              Subscription Features At A Glance
            </h3>
            <p className="text-muted small mb-0">
              Everything included across all our meal plans
            </p>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr className="text-roast fw-bold">
                  <th scope="col" className="py-3 px-4">Feature Inclusions</th>
                  <th scope="col" className="py-3 px-4 text-center">Weekly Plans</th>
                  <th scope="col" className="py-3 px-4 text-center bg-cream text-roast fw-bold">
                    Monthly Plans (₹3,500 / ₹4,500)
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">Custom Plans</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr>
                  <td className="py-3 px-4 fw-semibold text-dark">Fresh Whole Wheat Phulkas with Pure Cow Ghee</td>
                  <td className="py-3 px-4 text-center text-success fw-bold">✓ Included</td>
                  <td className="py-3 px-4 text-center text-success fw-bold bg-cream bg-opacity-30">✓ Included</td>
                  <td className="py-3 px-4 text-center text-success fw-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 fw-semibold text-dark">Rotational Homestyle Sabzi, Dal Tadka &amp; Rice</td>
                  <td className="py-3 px-4 text-center text-success fw-bold">✓ Included</td>
                  <td className="py-3 px-4 text-center text-success fw-bold bg-cream bg-opacity-30">✓ Included</td>
                  <td className="py-3 px-4 text-center text-success fw-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 fw-semibold text-dark">Pause / Skip Meal Flexibility</td>
                  <td className="py-3 px-4 text-center">1 Day Notice</td>
                  <td className="py-3 px-4 text-center font-bold text-secondary bg-cream bg-opacity-30">Up to 4 Days Free Pause</td>
                  <td className="py-3 px-4 text-center">Custom Days</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 fw-semibold text-dark">Doorstep Delivery</td>
                  <td className="py-3 px-4 text-center text-success fw-bold">Free</td>
                  <td className="py-3 px-4 text-center text-success fw-bold bg-cream bg-opacity-30">100% Free Always</td>
                  <td className="py-3 px-4 text-center">Included</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 fw-semibold text-dark">Insulated Stainless Steel Dabba Option</td>
                  <td className="py-3 px-4 text-center">Available</td>
                  <td className="py-3 px-4 text-center text-secondary fw-bold bg-cream bg-opacity-30">Complimentary</td>
                  <td className="py-3 px-4 text-center">Available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="container mb-4" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-4">
          <h3 className="font-serif fw-bold text-roast fs-3 mb-1">
            Frequently Asked Questions
          </h3>
          <p className="text-muted small mb-0">Have questions about how your subscription works?</p>
        </div>

        <div className="d-flex flex-column gap-3">
          <div className="card dr-card p-4">
            <h6 className="fw-bold text-roast mb-1 font-serif">
              Can I pause my subscription if I am travelling out of station?
            </h6>
            <p className="small text-muted mb-0 leading-relaxed">
              Yes, absolutely! On monthly subscriptions, you can pause your tiffin service for up to 4 days directly from your Customer Portal with just 2 hours advance notice. Your subscription end date will be extended automatically.
            </p>
          </div>

          <div className="card dr-card p-4">
            <h6 className="fw-bold text-roast mb-1 font-serif">
              What are the delivery timings for Lunch and Dinner?
            </h6>
            <p className="small text-muted mb-0 leading-relaxed">
              Breakfast is delivered between 7:30 AM and 8:30 AM. Lunch arrives between 12:00 PM and 1:30 PM. Dinner is delivered between 7:30 PM and 9:00 PM. You can specify precise slot preferences during checkout.
            </p>
          </div>

          <div className="card dr-card p-4">
            <h6 className="fw-bold text-roast mb-1 font-serif">
              What payment methods are supported?
            </h6>
            <p className="small text-muted mb-0 leading-relaxed">
              We support secure online payments via Razorpay (UPI, Google Pay, PhonePe, Cards, NetBanking) as well as Pay on Delivery for your complete convenience.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
