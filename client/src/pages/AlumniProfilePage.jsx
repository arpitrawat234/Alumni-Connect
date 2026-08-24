import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { alumniData } from '../data/alumni';
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Mail,
  Compass,
  Lightbulb,
  ExternalLink,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function AlumniProfilePage() {
  const { id } = useParams();
  const alumni = alumniData.find((a) => a.id === parseInt(id, 10));

  if (!alumni) {
    return (
      <div className="container page-wrapper animate-fade-in" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Alumni Profile Not Found</h2>
        <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          We couldn't find an alumni matching ID: <strong>{id}</strong>.
        </p>
        <Link to="/alumni" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to All Alumni</span>
        </Link>
      </div>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="container page-wrapper animate-fade-in">
      <div className="profile-page-wrapper">
        <Link to="/alumni" className="back-link-btn">
          <ArrowLeft size={16} />
          <span>Back to Alumni Directory</span>
        </Link>

        <div className="profile-main-card">
          {/* Header layout */}
          <div className="profile-header-layout">
            <div className="profile-user-details">
              {alumni.avatar ? (
                <img
                  src={alumni.avatar}
                  alt={alumni.name}
                  className="profile-large-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="profile-large-avatar"
                style={{
                  display: alumni.avatar ? 'none' : 'flex',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1.75rem',
                }}
              >
                {getInitials(alumni.name)}
              </div>

              <div>
                <h1>{alumni.name}</h1>
                <div className="profile-role-company">
                  {alumni.role} at {alumni.company}
                </div>
                <div className="profile-meta-row">
                  <div className="profile-meta-item">
                    <Building2 size={15} />
                    <span>{alumni.industry}</span>
                  </div>
                  <div className="profile-meta-item">
                    <Calendar size={15} />
                    <span>Batch of {alumni.graduationYear}</span>
                  </div>
                  <div className="profile-meta-item">
                    <MapPin size={15} />
                    <span>{alumni.location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => alert(`Phase 1 Prototype: Request sent to ${alumni.name}!`)}
                className="btn btn-primary"
              >
                <MessageSquare size={16} />
                <span>Request Mentorship</span>
              </button>
            </div>
          </div>

          {/* About section */}
          <div className="profile-section-block">
            <h3>About</h3>
            <p>{alumni.bio}</p>
          </div>

          {/* Skills section */}
          <div className="profile-section-block">
            <h3>Skills & Domain Expertise</h3>
            <div className="skills-badge-list" style={{ marginTop: '0.5rem' }}>
              {alumni.skills.map((skill, index) => (
                <span
                  key={index}
                  className="badge badge-primary"
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Career Journey section */}
          <div className="profile-section-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Compass size={20} color="var(--primary)" />
              <h3 style={{ margin: 0, borderLeft: 'none', paddingLeft: 0 }}>Career Journey</h3>
            </div>
            <p>{alumni.careerJourney}</p>
          </div>

          {/* Advice to students */}
          {alumni.advice && (
            <div className="advice-box">
              <div className="advice-box-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Lightbulb size={18} />
                <span>Advice for Students</span>
              </div>
              <p style={{ color: 'var(--text-main)', margin: 0 }}>"{alumni.advice}"</p>
            </div>
          )}

          {/* Contact Details */}
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Mail size={16} />
              <span>Email: <strong>{alumni.email}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
