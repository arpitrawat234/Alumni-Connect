import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, GraduationCap, ArrowRight } from 'lucide-react';

export default function AlumniCard({ alumni }) {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="alumni-card animate-fade-in">
      <div>
        <div className="alumni-card-top">
          {alumni.avatar ? (
            <img
              src={alumni.avatar}
              alt={alumni.name}
              className="alumni-avatar"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="alumni-avatar-placeholder"
            style={{ display: alumni.avatar ? 'none' : 'flex' }}
          >
            {getInitials(alumni.name)}
          </div>
          <div className="alumni-card-info">
            <h3>{alumni.name}</h3>
            <div className="alumni-headline">
              <span>{alumni.role}</span> at <span className="alumni-company-highlight">{alumni.company}</span>
            </div>
          </div>
        </div>

        <p className="alumni-bio-preview">{alumni.bio}</p>

        <div className="skills-badge-list">
          {alumni.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="badge">
              {skill}
            </span>
          ))}
          {alumni.skills.length > 3 && (
            <span className="badge badge-primary">+{alumni.skills.length - 3}</span>
          )}
        </div>
      </div>

      <div className="alumni-card-footer">
        <div className="alumni-location-tag">
          <MapPin size={13} />
          <span>{alumni.location || 'India'}</span>
        </div>
        <Link to={`/alumni/${alumni.id}`} className="btn btn-outline btn-sm">
          <span>View Profile</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
