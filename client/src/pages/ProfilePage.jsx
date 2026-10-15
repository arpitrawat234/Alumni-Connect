import React, { useContext, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { AuthContext } from '../AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const arrayFields = [
  'skills',
  'careerInterests',
  'helpTopics',
  'servicesOffered',
];

function parseList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProfilePage() {
  const { token, user, updateUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [listInputs, setListInputs] = useState({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();
    fetch(`${API_BASE}/profiles/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not load profile.');
        setProfile({ ...data.profile, name: data.user.name, email: data.user.email });
        setCompletionPercentage(data.completionPercentage);
        setListInputs(Object.fromEntries(
          arrayFields.map((field) => [field, (data.profile[field] || []).join(', ')]),
        ));
      })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [token]);

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSavedNotice(false);

    const payload = {
      name: profile.name,
      email: profile.email,
      college: profile.college,
      graduationYear: profile.graduationYear ? Number(profile.graduationYear) : null,
      skills: parseList(listInputs.skills || ''),
      bio: profile.bio,
    };

    if (user?.role === 'STUDENT') {
      payload.branch = profile.branch;
      payload.careerInterests = parseList(listInputs.careerInterests || '');
    } else {
      payload.currentCompany = profile.currentCompany;
      payload.currentRole = profile.currentRole;
      payload.industry = profile.industry;
      payload.location = profile.location;
      payload.experience = profile.experience;
      payload.helpTopics = parseList(listInputs.helpTopics || '');
      payload.servicesOffered = parseList(listInputs.servicesOffered || '');
    }

    try {
      const res = await fetch(`${API_BASE}/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(message || 'Could not save profile.');
      }

      setProfile({ ...data.profile, name: data.user.name, email: data.user.email });
      setCompletionPercentage(data.completionPercentage);
      updateUser(data.user);
      setListInputs(Object.fromEntries(
        arrayFields.map((field) => [field, (data.profile[field] || []).join(', ')]),
      ));
      setSavedNotice(true);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container page-wrapper">Loading profile...</div>;
  if (!profile) {
    return <div className="container page-wrapper">{error || 'Profile is unavailable.'}</div>;
  }

  const renderField = (label, field, options = {}) => (
    <div className="form-group" key={field}>
      <label className="form-label" htmlFor={field}>{label}</label>
      {options.multiline ? (
        <textarea
          id={field}
          rows={options.rows || 3}
          className="form-input"
          value={profile[field] || ''}
          onChange={(event) => handleChange(field, event.target.value)}
        />
      ) : (
        <input
          id={field}
          type={options.type || 'text'}
          className="form-input"
          value={profile[field] ?? ''}
          onChange={(event) => handleChange(field, event.target.value)}
        />
      )}
    </div>
  );

  const renderListField = (label, field) => (
    <div className="form-group" key={field}>
      <label className="form-label" htmlFor={field}>{label}</label>
      <input
        id={field}
        className="form-input"
        value={listInputs[field] || ''}
        onChange={(event) => setListInputs((current) => ({
          ...current,
          [field]: event.target.value,
        }))}
        placeholder="Separate items with commas"
      />
    </div>
  );

  return (
    <div className="container page-wrapper animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>My Profile</h1>
        <p>Edit your {user?.role === 'ALUMNI' ? 'alumni' : 'student'} profile and matching tags.</p>
        <p>Profile completion: <strong>{completionPercentage}%</strong></p>
      </div>

      {error && <div className="card" role="alert" style={{ marginBottom: '1rem' }}>{error}</div>}
      {savedNotice && (
        <div className="badge badge-primary" role="status" style={{ display: 'block', padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.95rem' }}>
          Profile changes saved.
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          {renderField('Full name', 'name')}
          {renderField('Email address', 'email', { type: 'email' })}
          {renderField('College', 'college')}
          {renderField('Graduation year', 'graduationYear', { type: 'number' })}
          {renderField('About / bio', 'bio', { multiline: true, rows: 4 })}
          {renderListField('Skills', 'skills')}

          {user?.role === 'STUDENT' ? (
            <>
              {renderField('Branch / program', 'branch')}
              {renderListField('Career interests', 'careerInterests')}
            </>
          ) : (
            <>
              {renderField('Current company', 'currentCompany')}
              {renderField('Current role', 'currentRole')}
              {renderField('Industry', 'industry')}
              {renderField('Location', 'location')}
              {renderField('Experience', 'experience', { multiline: true })}
              {renderListField('Topics you can help with', 'helpTopics')}
              {renderListField('Mentoring services offered', 'servicesOffered')}
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save profile'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
