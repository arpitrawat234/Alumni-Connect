import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AlumniPage from './pages/AlumniPage';
import AlumniProfilePage from './pages/AlumniProfilePage';
import ProfilePage from './pages/ProfilePage';
import QuestionsPage from './pages/QuestionsPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/alumni" element={<AlumniPage />} />
            <Route path="/alumni/:id" element={<AlumniProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>© {new Date().getFullYear()} AlumniConnect. Smart Alumni Guidance Platform.</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
