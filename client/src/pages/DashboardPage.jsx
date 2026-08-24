import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, HelpCircle, ArrowRight, Compass, Sparkles } from 'lucide-react';
import BackendStatus from '../components/BackendStatus';

export default function DashboardPage() {
  return (
    <div className="container page-wrapper animate-fade-in">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" />
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--primary)' }}>
              Student & Alumni Hub
            </span>
          </div>
          <h1>Welcome Back!</h1>
          <p>What would you like to do today? Choose an option below to get started.</p>
        </div>
        <BackendStatus />
      </div>

      <div className="dashboard-actions-grid">
        <div className="action-card">
          <div>
            <div className="action-card-header">
              <div className="action-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <Users size={24} />
              </div>
              <div>
                <h3>Find Alumni</h3>
                <p>Browse alumni across top companies and request career guidance or resume feedback.</p>
              </div>
            </div>
          </div>
          <Link to="/alumni" className="btn btn-primary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <span>Explore Directory</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="action-card">
          <div>
            <div className="action-card-header">
              <div className="action-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <User size={24} />
              </div>
              <div>
                <h3>My Profile</h3>
                <p>Manage your public bio, education background, target roles, and career interests.</p>
              </div>
            </div>
          </div>
          <Link to="/profile" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <span>View & Edit Profile</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="action-card">
          <div>
            <div className="action-card-header">
              <div className="action-icon-box" style={{ background: '#fef3c7', color: '#d97706' }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <h3>Ask a Question</h3>
                <p>Post questions to the community about interviews, referrals, and domain specializations.</p>
              </div>
            </div>
          </div>
          <Link to="/questions" className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
            <span>Go to Q&A Board</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
