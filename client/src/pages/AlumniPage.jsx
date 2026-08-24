import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, Users } from 'lucide-react';
import { alumniData } from '../data/alumni';
import AlumniCard from '../components/AlumniCard';

export default function AlumniPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  // Extract unique filter options dynamically or from static constants
  const roles = useMemo(() => {
    return ['All', ...new Set(alumniData.map((a) => a.role))];
  }, []);

  const companies = useMemo(() => {
    return ['All', ...new Set(alumniData.map((a) => a.company))];
  }, []);

  const industries = useMemo(() => {
    return ['All', ...new Set(alumniData.map((a) => a.industry))];
  }, []);

  // Filter logic: Derived state
  const filteredAlumni = useMemo(() => {
    return alumniData.filter((alumni) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        alumni.name.toLowerCase().includes(term) ||
        alumni.company.toLowerCase().includes(term) ||
        alumni.role.toLowerCase().includes(term) ||
        alumni.skills.some((skill) => skill.toLowerCase().includes(term));

      const matchesRole = selectedRole === 'All' || alumni.role === selectedRole;
      const matchesCompany = selectedCompany === 'All' || alumni.company === selectedCompany;
      const matchesIndustry = selectedIndustry === 'All' || alumni.industry === selectedIndustry;

      return matchesSearch && matchesRole && matchesCompany && matchesIndustry;
    });
  }, [searchTerm, selectedRole, selectedCompany, selectedIndustry]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All');
    setSelectedCompany('All');
    setSelectedIndustry('All');
  };

  const isFiltered =
    searchTerm !== '' ||
    selectedRole !== 'All' ||
    selectedCompany !== 'All' ||
    selectedIndustry !== 'All';

  return (
    <div className="container page-wrapper animate-fade-in">
      <div className="alumni-header">
        <h1>Find Alumni</h1>
        <p>Discover and connect with seniors working across top global companies.</p>
      </div>

      {/* Filter and Search Controls */}
      <div className="filter-bar-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by name, company (e.g. Amazon, Google), role, or skills (e.g. React)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <div className="filter-item">
            <label htmlFor="role-select">Role</label>
            <select
              id="role-select"
              className="form-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Roles' : r}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="company-select">Company</label>
            <select
              id="company-select"
              className="form-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Companies' : c}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="industry-select">Industry</label>
            <select
              id="industry-select"
              className="form-select"
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind === 'All' ? 'All Industries' : ind}
                </option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="btn btn-secondary btn-sm"
              style={{ height: '42px', alignSelf: 'flex-end' }}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="results-meta">
        <div>
          Showing <strong>{filteredAlumni.length}</strong> of {alumniData.length} alumni
        </div>
        {isFiltered && (
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Filters applied</span>
        )}
      </div>

      {/* Alumni Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="alumni-grid">
          {filteredAlumni.map((alumni) => (
            <AlumniCard key={alumni.id} alumni={alumni} />
          ))}
        </div>
      ) : (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3.5rem 1.5rem',
            backgroundColor: '#ffffff',
            color: 'var(--text-muted)',
          }}
        >
          <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-light)' }} />
          <h3>No matching alumni found</h3>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Try broadening your search term or clearing one of your selected filters.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
            <RotateCcw size={14} />
            <span>Clear All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
