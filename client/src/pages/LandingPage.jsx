import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, PlusCircle, Sparkles } from 'lucide-react';
import { buildActivityFeed } from '../utils/activityFeed';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const activityLabels = {
  question: 'asked a question',
  answer: 'answered a question',
  comment: 'joined a discussion',
};

export default function LandingPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/questions`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not load the community feed.');
        setActivities(buildActivityFeed(data));
      })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="container page-wrapper animate-fade-in home-feed">
      <header className="feed-header">
        <div>
          <div className="hero-pill"><Sparkles size={15} /> AlumniConnect Community</div>
          <h1>Learn from the community</h1>
          <p>Questions, alumni answers, and discussion updates from students and graduates.</p>
        </div>
        <div className="feed-header-actions">
          <Link to="/questions" className="btn btn-primary"><PlusCircle size={17} /> Start a discussion</Link>
          <Link to="/alumni" className="btn btn-secondary">Find alumni <ArrowRight size={15} /></Link>
        </div>
      </header>

      <div className="feed-layout">
        <section className="activity-feed" aria-label="Community activity feed">
          <div className="feed-section-heading">
            <div><h2>Community feed</h2><p>Each activity opens its full Q&amp;A thread.</p></div>
            <MessageSquare size={20} />
          </div>
          {loading ? (
            <div className="card">Loading community activity...</div>
          ) : error ? (
            <div className="card" role="alert">{error}</div>
          ) : activities.length === 0 ? (
            <div className="card feed-empty">
              <h3>The community feed is ready for its first post</h3>
              <p>Ask a career question to start a discussion. Alumni and other students can reply with answers and comments.</p>
              <Link to="/questions" className="btn btn-primary">Ask the first question</Link>
            </div>
          ) : (
            <div className="activity-list">
              {activities.map((activity) => (
                <article className="activity-card" key={activity.id}>
                  <div className={`activity-marker activity-marker-${activity.type}`} aria-hidden="true">
                    <MessageSquare size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-meta">
                      <strong>{activity.actor.name}</strong>
                      <span>{activityLabels[activity.type]}</span>
                      <span>{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                    <Link to={`/questions#question-${activity.questionId}`} className="activity-question-title">
                      {activity.questionTitle}
                    </Link>
                    <p>{activity.body}</p>
                    <div className="skills-badge-list">
                      {activity.tags.map((tag) => <span key={tag} className="badge">#{tag}</span>)}
                    </div>
                    <Link to={`/questions#question-${activity.questionId}`} className="activity-open-link">
                      Open discussion <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="feed-sidebar">
          <div className="card">
            <h3>Make a useful contribution</h3>
            <p>Tag topics and people in a question so the right students and alumni can find the conversation.</p>
            <Link to="/questions" className="btn btn-secondary btn-sm">Browse Q&amp;A</Link>
          </div>
          <div className="card">
            <h3>Find a mentor</h3>
            <p>Explore verified alumni profiles or get tag-based recommendations from your dashboard.</p>
            <Link to="/alumni" className="btn btn-secondary btn-sm">Explore alumni</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
