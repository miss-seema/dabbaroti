import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Droplets,
  UtensilsCrossed,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="font-sans py-5">

      {/* Header Banner */}
      <section className="text-center py-5 bg-white border-bottom mb-5">
        <div className="container">
          <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
            About Dabba Roti
          </span>
          <h1 className="font-serif display-4 fw-black text-roast mb-2">
            The Story Behind Every Hot Dabba
          </h1>
          <p className="font-serif fst-italic text-secondary fs-5 fw-bold mb-3">
            "A Taste You'll Keep Coming Back For!"
          </p>
          <p className="lead text-muted fs-6 col-lg-8 mx-auto mb-0" style={{ lineHeight: '1.8' }}>
            Founded with a heartfelt mission: to serve authentic, nutritious, and hygienic home-cooked meals to working professionals, students, and busy families in Mohali.
          </p>
        </div>
      </section>

      {/* Main Story & Philosophy */}
      <section className="container mb-5">
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
              Our Journey
            </span>
            <h2 className="font-serif fw-bold text-roast fs-2 mb-3">
              Bringing Back the Nostalgia of 'Maa Ke Haath Ka Khana'
            </h2>
            <p className="text-muted small leading-relaxed mb-3">
              Living away from home often means surviving on oily restaurant food, bland mess meals, or skipped lunches. Dabba Roti was born out of our founders' own frustration with unhygienic takeout.
            </p>
            <p className="text-muted small leading-relaxed mb-3">
              We asked a simple question: <em>Why can't everyday tiffin food be as honest, wholesome, and delicious as food cooked in a mother's kitchen?</em>
            </p>
            <p className="text-muted small leading-relaxed mb-4">
              Today, Dabba Roti cooks for thousands of patrons every day. We prepare fresh dough for every meal, use unadulterated cold-pressed oils and pure desi cow ghee, hand-pick farm-fresh vegetables, and never use commercial preservatives, artificial food colors, or soda.
            </p>

            <div className="row g-3">
              <div className="col-6">
                <div className="card dr-card p-3 border">
                  <div className="fs-3 fw-black text-roast font-serif">100%</div>
                  <div className="small fw-bold text-dark">Pure Whole Wheat</div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Zero maida in all our rotis</span>
                </div>
              </div>
              <div className="col-6">
                <div className="card dr-card p-3 border">
                  <div className="fs-3 fw-black text-secondary font-serif">30+</div>
                  <div className="small fw-bold text-dark">Rotational Recipes</div>
                  <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Never get bored of meals</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card dr-card overflow-hidden shadow-lg border-4 border-white" style={{ height: '420px' }}>
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80"
                alt="Dabba Roti Chef Cooking Fresh Homestyle Meals"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-5 border-top border-bottom mb-5">
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card dr-card bg-cream-card p-4 p-md-5 border-0 h-100">
                <div className="rounded-4 bg-roast text-white p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
                  <Sparkles size={24} />
                </div>
                <h3 className="font-serif fw-bold text-roast fs-3 mb-2">Our Mission</h3>
                <p className="text-muted small leading-relaxed mb-0">
                  To deliver clean, nourishing, and affordable home-style meals to every door, liberating people from everyday cooking fatigue while promoting long-term health and wellness through honest nutrition.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="card dr-card bg-cream-card p-4 p-md-5 border-0 h-100">
                <div className="rounded-4 bg-terracotta text-white p-3 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '48px', height: '48px' }}>
                  <Heart size={24} />
                </div>
                <h3 className="font-serif fw-bold text-roast fs-3 mb-2">Our Vision</h3>
                <p className="text-muted small leading-relaxed mb-0">
                  To become Central India's most trusted food subscription brand, celebrated for uncompromised hygiene, authentic flavors, eco-conscious packaging, and genuine customer care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hygiene Standards */}
      <section className="container mb-5">
        <div className="text-center max-w-xl mx-auto mb-5">
          <span className="badge rounded-pill bg-cream text-roast border px-3 py-1 fw-bold text-uppercase small mb-2">
            Zero Tolerance on Quality
          </span>
          <h2 className="font-serif fw-bold text-roast fs-2">
            Food Quality &amp; Hygiene Standards
          </h2>
          <p className="text-muted small mb-0">
            We follow strict 7-point hygiene protocols at our central commercial kitchen.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="card dr-card p-4 h-100">
              <ShieldCheck size={36} className="text-success mb-3" />
              <h5 className="font-serif fw-bold text-roast mb-2">FSSAI Certified Operations</h5>
              <p className="text-muted small mb-0">
                Fully compliant commercial facility with automated dishwasher sanitization at 85°C.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card dr-card p-4 h-100">
              <Droplets size={36} className="text-primary mb-3" />
              <h5 className="font-serif fw-bold text-roast mb-2">RO Purified Water</h5>
              <p className="text-muted small mb-0">
                Every drop of water used for washing vegetables, kneading dough, and cooking is multi-stage RO purified.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card dr-card p-4 h-100">
              <UtensilsCrossed size={36} className="text-secondary mb-3" />
              <h5 className="font-serif fw-bold text-roast mb-2">Stainless Steel Dabbas</h5>
              <p className="text-muted small mb-0">
                We prioritize eco-friendly, food-grade 304 stainless steel tiffins that keep food hot without chemical plastic leaching.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link to="/plans" className="btn btn-roast btn-lg rounded-4 px-5 py-3 fw-bold d-inline-flex align-items-center gap-2">
            <span>Choose Your Tiffin Plan Today</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
