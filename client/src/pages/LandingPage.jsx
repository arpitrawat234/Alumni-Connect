import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, Search, MessageSquare, Compass, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="landing-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>Smart Alumni Guidance Platform</span>
          </div>

          <h1 className="hero-title">
            Connect with Alumni. <br />
            <span className="text-gradient">Get Real Career Guidance.</span>
          </h1>

          <p className="hero-subtitle">
            Bridge the gap between college and the industry. Discover verified alumni from top tech, finance, and consulting firms to unlock mentorship, mock interviews, and referral insights.
          </p>

          <div className="hero-cta-group">
            <Link to="/alumni" className="btn btn-primary btn-lg">
              <Search size={18} />
              <span>Find Alumni</span>
            </Link>
            <Link to="/signup" className="btn btn-secondary btn-lg">
              <span>Join the Community</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Search size={24} />
              </div>
              <h3>Smart Search & Filtering</h3>
              <p>
                Filter alumni by target company, role, engineering skills, and graduation year to find the exact mentor you need.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Compass size={24} />
              </div>
              <h3>Career Journey Insights</h3>
              <p>
                Learn directly from real career transitions, placement preparation advice, and interview experiences of your seniors.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <MessageSquare size={24} />
              </div>
              <h3>Community Q&A</h3>
              <p>
                Post queries regarding job drives, resume reviews, and industry expectations and receive authentic answers from alumni.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
            color: '#ffffff',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            border: 'none',
          }}
        >
          <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '1rem' }}>
            Ready to jumpstart your career network?
          </h2>
          <p style={{ color: '#e0e7ff', maxWidth: '600px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
            Explore profiles of graduates working at Microsoft, Amazon, Google, Goldman Sachs, and more.
          </p>
          <Link
            to="/alumni"
            className="btn btn-secondary btn-lg"
            style={{ color: 'var(--primary)', fontWeight: '700' }}
          >
            Start Exploring Alumni
          </Link>
        </div>
      </section>
    </div>
  );
}
