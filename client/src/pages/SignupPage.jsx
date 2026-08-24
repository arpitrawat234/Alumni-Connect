import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck, GraduationCap, Briefcase } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student' // 'Student' or 'Alumni'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Phase 1: Prototype navigation without real backend authentication
    navigate('/dashboard');
  };

  return (
    <div className="auth-page-container animate-fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join AlumniConnect to explore mentors and discussions</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              required
              className="form-input"
              placeholder="e.g. Arpit Sharma"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="form-input"
              placeholder="e.g. arpit@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">I am a:</label>
            <div className="role-radio-group">
              <div
                className={`role-radio-label ${formData.role === 'Student' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('Student')}
              >
                <GraduationCap size={16} />
                <span>Student</span>
              </div>
              <div
                className={`role-radio-label ${formData.role === 'Alumni' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('Alumni')}
              >
                <Briefcase size={16} />
                <span>Alumni</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1.25rem' }}>
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
