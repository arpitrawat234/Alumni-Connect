import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, Users } from 'lucide-react';
import AlumniCard from '../components/AlumniCard';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AlumniPage() {
  const [alumni, setAlumni] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE}/alumni`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not load alumni.');
        setAlumni(data.map((profile) => ({
          id: profile.id,
          name: profile.userId.name,
          role: profile.currentRole || 'Alumni',
          company: profile.currentCompany || '',
          industry: profile.industry || '',
          graduationYear: profile.graduationYear,
          location: profile.location || '',
          skills: profile.skills || [],
          bio: profile.bio || '',
        })));
      })
      .catch((loadError) => {
        if (loadError.name !== 'AbortError') setError(loadError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const roles = useMemo(() => ['All', ...new Set(alumni.map((person) => person.role).filter(Boolean))], [alumni]);
  const companies = useMemo(() => ['All', ...new Set(alumni.map((person) => person.company).filter(Boolean))], [alumni]);
  const industries = useMemo(() => ['All', ...new Set(alumni.map((person) => person.industry).filter(Boolean))], [alumni]);

  const filteredAlumni = useMemo(() => alumni.filter((person) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || [
      person.name,
      person.company,
      person.role,
      person.industry,
      ...person.skills,
    ].some((value) => value?.toLowerCase().includes(term));

    return matchesSearch
      && (selectedRole === 'All' || person.role === selectedRole)
      && (selectedCompany === 'All' || person.company === selectedCompany)
      && (selectedIndustry === 'All' || person.industry === selectedIndustry);
  }), [alumni, searchTerm, selectedRole, selectedCompany, selectedIndustry]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRole('All');
    setSelectedCompany('All');
    setSelectedIndustry('All');
  };

  const isFiltered = searchTerm || selectedRole !== 'All' || selectedCompany !== 'All' || selectedIndustry !== 'All';

  return (
    <div className="container page-wrapper animate-fade-in">
      <div className="alumni-header">
        <h1>Find Alumni</h1>
        <p>Discover verified alumni and filter by role, company, industry, or skills.</p>
      </div>

      <div className="filter-bar-card">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            className="form-input search-input"
            placeholder="Search name, company, role, industry, or skill"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="filters-row">
          {[
            ['Role', selectedRole, setSelectedRole, roles],
            ['Company', selectedCompany, setSelectedCompany, companies],
            ['Industry', selectedIndustry, setSelectedIndustry, industries],
          ].map(([label, value, setValue, options]) => (
            <div className="filter-item" key={label}>
              <label htmlFor={`${label.toLowerCase()}-filter`}>{label}</label>
              <select
                id={`${label.toLowerCase()}-filter`}
                className="form-select"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              >
                {options.map((option) => (
                  <option key={option} value={option}>{option === 'All' ? `All ${label}s` : option}</option>
                ))}
              </select>
            </div>
          ))}
          {isFiltered && (
            <button onClick={resetFilters} className="btn btn-secondary btn-sm" type="button">
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="results-meta">
        Showing <strong>{filteredAlumni.length}</strong> of {alumni.length} verified alumni
      </div>

      {loading ? (
        <div className="card">Loading alumni...</div>
      ) : error ? (
        <div className="card" role="alert">{error}</div>
      ) : filteredAlumni.length ? (
        <div className="alumni-grid">
          {filteredAlumni.map((person) => <AlumniCard key={person.id} alumni={person} />)}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Users size={42} style={{ margin: '0 auto 1rem' }} />
          <h3>{alumni.length ? 'No matching alumni found' : 'No verified alumni profiles yet'}</h3>
          <p>Try different filters, or check back as alumni complete their profiles.</p>
          {isFiltered && <button onClick={resetFilters} className="btn btn-primary btn-sm">Clear filters</button>}
        </div>
      )}
    </div>
  );
}
