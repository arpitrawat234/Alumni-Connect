import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import BackendStatus from '../components/BackendStatus';
import { AuthContext } from '../AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function DashboardPage() {
  const { user, token } = useContext(AuthContext);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationError, setRecommendationError] = useState('');
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [overview, setOverview] = useState({ completion: 0, questions: 0, answers: 0 });

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/profiles/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not load profile overview.');
        setOverview((current) => ({ ...current, completion: data.completionPercentage }));
      })
      .catch((error) => setRecommendationError(error.message));

    fetch(`${API_BASE}/questions`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not load Q&A overview.');
        setOverview((current) => ({
          ...current,
          questions: data.length,
          answers: data.reduce((total, question) => total + question.answers.length, 0),
        }));
      })
      .catch((error) => setRecommendationError(error.message));

    if (user?.role === 'STUDENT') {
      setRecommendationsLoading(true);
      fetch(`${API_BASE}/profiles/recommendations`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Could not load mentor recommendations.');
          setRecommendations(data);
        })
        .catch((error) => setRecommendationError(error.message))
        .finally(() => setRecommendationsLoading(false));
    }
  }, [user?.role, token]);

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
          <h1>Welcome back, {user?.name || 'friend'}!</h1>
          <p>Your {user?.role === 'ALUMNI' ? 'alumni' : 'student'} community overview and next steps.</p>
        </div>
        <BackendStatus />
      </div>

      <div className="dashboard-overview">
        <article className="dashboard-stat-card">
          <span>Profile completion</span>
          <strong>{overview.completion}%</strong>
          <Link to="/profile">Complete your profile <ArrowRight size={13} /></Link>
        </article>
        <article className="dashboard-stat-card">
          <span>Community questions</span>
          <strong>{overview.questions}</strong>
          <Link to="/questions">Join the discussion <ArrowRight size={13} /></Link>
        </article>
        <article className="dashboard-stat-card">
          <span>Answers shared</span>
          <strong>{overview.answers}</strong>
          <Link to="/">See the community feed <ArrowRight size={13} /></Link>
        </article>
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

      {user?.role === 'STUDENT' && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2>Recommended alumni</h2>
          <p>Matched using shared skills and career-interest tags from your profile.</p>
          {recommendationsLoading ? (
            <p>Finding alumni with matching topics...</p>
          ) : recommendationError ? (
            <p role="alert">{recommendationError}</p>
          ) : recommendations.length === 0 ? (
            <div className="card" style={{ marginTop: '1rem' }}>
              Add skills and career interests to your profile to get tag-based mentor suggestions.
              <div style={{ marginTop: '1rem' }}>
                <Link to="/profile" className="btn btn-secondary btn-sm">Complete my profile</Link>
              </div>
            </div>
          ) : (
            <div className="alumni-grid" style={{ marginTop: '1rem' }}>
              {recommendations.map((alumni) => (
                <article key={alumni.id} className="action-card">
                  <div>
                    <h3>{alumni.userId.name}</h3>
                    <p>{alumni.currentRole || 'Alumni'}{alumni.currentCompany ? ` · ${alumni.currentCompany}` : ''}</p>
                    <p><strong>{alumni.matchScore}% tag match</strong></p>
                    <div className="skills-badge-list">
                      {alumni.matchingTags.map((tag) => <span key={tag} className="badge badge-primary">{tag}</span>)}
                    </div>
                  </div>
                  <Link to={`/alumni/${alumni.id}`} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    View profile
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
