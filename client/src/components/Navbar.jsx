import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { GraduationCap, Users, MessageSquare, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { AuthContext } from '../AuthContext';

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <GraduationCap size={20} />
          </div>
          <span>AlumniConnect</span>
        </Link>

        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/alumni" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Find Alumni
              </NavLink>
            </li>
            <li>
              <NavLink to="/questions" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Q&A
              </NavLink>
            </li>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Dashboard
              </NavLink>
            </li>
          </ul>
        </nav>

          {/* Auth actions */}
          <div className="navbar-actions">
            {token ? (
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  <LogIn size={15} />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  <UserPlus size={15} />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
      </div>
    </header>
  );
}
