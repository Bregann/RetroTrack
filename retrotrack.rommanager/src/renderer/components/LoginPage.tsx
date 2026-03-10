import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      onLogin(username);
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-icon">🎮</span>
          <h1>RetroTrack</h1>
          <p className="login-subtitle">ROM Manager</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username">RetroTrack Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <a href="https://retrotrack.app" target="_blank" rel="noreferrer">
            Sign up at retrotrack.app
          </a>
        </p>
      </div>
    </div>
  );
}
