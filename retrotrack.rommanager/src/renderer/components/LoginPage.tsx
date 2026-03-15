import { useState } from 'react';
import { useAuth } from '../context/authContext';
import type { Channels } from '../../../main/preload';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    const success = await login(username.trim(), password);
    setLoading(false);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  const handleWindowControl = (action: string) => {
    window.electron?.ipcRenderer.sendMessage(action as Channels);
  };

  return (
    <div className="login-page">
      <div className="login-window-controls">
        <button
          type="button"
          className="window-ctrl-btn"
          title="Minimize"
          onClick={() => handleWindowControl('window-minimize')}
        >
          ─
        </button>
        <button
          type="button"
          className="window-ctrl-btn window-ctrl-close"
          title="Close"
          onClick={() => handleWindowControl('window-close')}
        >
          ✕
        </button>
      </div>
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
            <div className="login-password-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <a href="https://retrotrack.bregan.me" target="_blank" rel="noreferrer">
            Sign up at retrotrack.bregan.me
          </a>
        </p>
      </div>
    </div>
  );
}
