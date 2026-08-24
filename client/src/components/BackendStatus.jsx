import React, { useState, useEffect } from 'react';
import { Activity, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BackendStatus() {
  const [status, setStatus] = useState('checking'); // 'connected', 'error', 'checking'
  const [data, setData] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const json = await response.json();
        setData(json);
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsRefreshing(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkHealth();
    // Re-check periodically every 15 seconds
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        padding: '0.45rem 0.9rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: status === 'connected' ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${status === 'connected' ? '#bbf7d0' : '#fecaca'}`,
        fontSize: '0.825rem',
        fontWeight: '600',
        color: status === 'connected' ? '#166534' : '#991b1b',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: status === 'connected' ? '#22c55e' : '#ef4444',
            display: 'inline-block',
            boxShadow:
              status === 'connected'
                ? '0 0 0 2px rgba(34, 197, 94, 0.25)'
                : '0 0 0 2px rgba(239, 68, 68, 0.25)',
          }}
        />
        <span>
          {status === 'connected'
            ? 'Backend API Connected'
            : status === 'checking'
            ? 'Checking Backend...'
            : 'Backend Offline (localhost:5000)'}
        </span>
      </div>

      <button
        onClick={checkHealth}
        disabled={isRefreshing}
        title="Check Backend Health"
        style={{
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
          opacity: isRefreshing ? 0.5 : 0.75,
          cursor: 'pointer',
        }}
      >
        <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
      </button>
    </div>
  );
}
