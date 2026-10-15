import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Calendar, Compass, MapPin } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AlumniProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/alumni/${encodeURIComponent(id)}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Alumni profile not found.');
        setProfile({
          ...data,
          name: data.userId.name,
          accountId: data.userId.id,
        });
      })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="container page-wrapper">Loading alumni profile...</div>;
  if (error || !profile) {
    return (
      <div className="container page-wrapper" role="alert">
        <h2>Alumni profile unavailable</h2>
        <p>{error}</p>
        <Link to="/alumni" className="btn btn-primary"><ArrowLeft size={16} /> Back to alumni</Link>
      </div>
    );
  }

  return (
    <div className="container page-wrapper animate-fade-in">
      <div className="profile-page-wrapper">
        <Link to="/alumni" className="back-link-btn"><ArrowLeft size={16} /> Back to Alumni Directory</Link>
        <article className="profile-main-card">
          <div className="profile-header-layout">
            <div className="profile-user-details">
              <div className="profile-large-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {profile.name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h1>{profile.name}</h1>
                <div className="profile-role-company">
                  {profile.currentRole || 'Alumni'}{profile.currentCompany ? ` at ${profile.currentCompany}` : ''}
                </div>
                <div className="profile-meta-row">
                  {profile.industry && <span className="profile-meta-item"><Building2 size={15} /> {profile.industry}</span>}
                  {profile.graduationYear && <span className="profile-meta-item"><Calendar size={15} /> Batch of {profile.graduationYear}</span>}
                  {profile.location && <span className="profile-meta-item"><MapPin size={15} /> {profile.location}</span>}
                </div>
              </div>
            </div>
          </div>

          {profile.bio && <section className="profile-section-block"><h3>About</h3><p>{profile.bio}</p></section>}
          {profile.experience && (
            <section className="profile-section-block">
              <h3><Compass size={18} /> Career Journey</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{profile.experience}</p>
            </section>
          )}
          <section className="profile-section-block">
            <h3>Skills and expertise</h3>
            <div className="skills-badge-list">
              {profile.skills.map((skill) => <span key={skill} className="badge badge-primary">{skill}</span>)}
            </div>
          </section>
          {profile.helpTopics?.length > 0 && (
            <section className="profile-section-block">
              <h3>Topics I can help with</h3>
              <div className="skills-badge-list">
                {profile.helpTopics.map((topic) => <span key={topic} className="badge">{topic}</span>)}
              </div>
            </section>
          )}
          <Link
            to={`/questions?mention=${encodeURIComponent(profile.accountId)}&name=${encodeURIComponent(profile.name)}`}
            className="btn btn-primary"
          >
            Ask this alumnus a question
          </Link>
        </article>
      </div>
    </div>
  );
}
