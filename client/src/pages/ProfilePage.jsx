import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../AuthContext";
import { Save } from 'lucide-react';

export default function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    if (!token) return; // not authenticated yet
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    fetch(`${API_BASE}/profiles/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile(data.profile);
      })
      .catch((err) => {
        console.error(err);
        alert('Could not load profile.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setProfile(data.profile);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <div className="container page-wrapper">Loading profile...</div>;

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        <p>This section will allow students and alumni to manage and customize their public profile.</p>
      </div>

      {savedNotice && (
        <div className="badge badge-primary" style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.95rem' }}>
          ✓ Profile changes saved!
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
              {profile.name ? profile.name.charAt(0).toUpperCase() : ''}
            </div>
            <div>
              <h3>{profile.name}</h3>
              <p style={{ fontSize: '0.9rem' }}>{profile.roleType} • Batch of {profile.graduationYear}</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" value={profile.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={profile.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Target Role / Designation</label>
            <input type="text" className="form-input" value={profile.targetRole || ''} onChange={(e) => handleChange('targetRole', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">About / Bio</label>
            <textarea rows={4} className="form-input" value={profile.bio || ''} onChange={(e) => handleChange('bio', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Skills & Interests</label>
            <div className="skills-badge-list" style={{ marginTop: '0.5rem' }}>
              {profile.skills && profile.skills.map((skill, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{skill}</span>
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
