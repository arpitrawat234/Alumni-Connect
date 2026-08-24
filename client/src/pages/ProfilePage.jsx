import React, { useState } from 'react';
import { User, Mail, GraduationCap, Briefcase, Plus, Save } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Arpit Sharma',
    email: 'arpit.student@example.com',
    roleType: 'Student',
    targetRole: 'Software Engineer / Full Stack',
    graduationYear: '2026',
    bio: 'Computer Science undergraduate enthusiastic about React, modern web development, and cloud computing. Actively preparing for SDE placements.',
    skills: ['React', 'JavaScript', 'Node.js', 'Data Structures', 'Git']
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        <p>This section will allow students and alumni to manage and customize their public profile.</p>
      </div>

      {savedNotice && (
        <div
          className="badge badge-primary"
          style={{
            display: 'block',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            fontSize: '0.95rem',
          }}
        >
          ✓ Prototype changes saved locally!
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1.5rem',
              }}
            >
              AS
            </div>
            <div>
              <h3>{profile.name}</h3>
              <p style={{ fontSize: '0.9rem' }}>{profile.roleType} • Batch of {profile.graduationYear}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Target Role / Designation</label>
            <input
              type="text"
              className="form-input"
              value={profile.targetRole}
              onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">About / Bio</label>
            <textarea
              rows={4}
              className="form-input"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Skills & Interests</label>
            <div className="skills-badge-list" style={{ marginTop: '0.5rem' }}>
              {profile.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.85rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={16} />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
