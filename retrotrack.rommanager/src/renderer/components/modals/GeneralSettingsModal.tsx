import { useState } from 'react';

interface Props {
  onClose: () => void;
}

const APP_VERSION = '1.0.0';
const LAST_UPDATED = 'March 13, 2026';
const BUILD_TARGET = 'Electron + React + TypeScript';
const DATA_SOURCE = 'RetroAchievements API';
const LICENSE = 'MIT';
const GITHUB_URL = 'https://github.com/retrotrack/retrotrack.rommanager';

export default function GeneralSettingsModal({ onClose }: Props) {
  const [cacheStatus, setCacheStatus] = useState<'idle' | 'confirming' | 'clearing' | 'done'>('idle');
  const [clearedCount, setClearedCount] = useState(0);

  const handleClearCache = async () => {
    setCacheStatus('clearing');
    const count = await window.electron.cache.clearImageCache();
    setClearedCount(count);
    setCacheStatus('done');
  };
  return (
    <div className="gs-backdrop" onClick={onClose}>
      <div className="gs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="gs-header">
          <h2>About RetroTrack</h2>
          <button type="button" className="gs-close" onClick={onClose}>✕</button>
        </div>

        <div className="gs-content">
          <div className="gs-logo-row">
            <span className="gs-logo">🎮</span>
            <div>
              <div className="gs-app-name">RetroTrack ROM Manager</div>
              <div className="gs-app-tagline">Your retro library, tracked.</div>
            </div>
          </div>

          <div className="gs-info-grid">
            <div className="gs-info-row">
              <span className="gs-info-label">Version</span>
              <span className="gs-info-value">v{APP_VERSION}</span>
            </div>
            <div className="gs-info-row">
              <span className="gs-info-label">Last Updated</span>
              <span className="gs-info-value">{LAST_UPDATED}</span>
            </div>
            <div className="gs-info-row">
              <span className="gs-info-label">Built With</span>
              <span className="gs-info-value">{BUILD_TARGET}</span>
            </div>
            <div className="gs-info-row">
              <span className="gs-info-label">Data Source</span>
              <span className="gs-info-value">{DATA_SOURCE}</span>
            </div>
            <div className="gs-info-row">
              <span className="gs-info-label">License</span>
              <span className="gs-info-value">{LICENSE}</span>
            </div>
          </div>

          <div className="gs-action-row">
            <button type="button" className="gs-update-btn">
              🔄 Check for Updates
            </button>
            <button
              type="button"
              className="gs-github-btn"
              onClick={() => window.open(GITHUB_URL, '_blank')}
            >
              <svg className="gs-github-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </button>
          </div>

          <div className="gs-danger-section">
            <div className="gs-danger-header">Image Cache</div>
            <p className="gs-danger-desc">
              Game icons and box art are cached locally to avoid re-downloading them every time.
              Clear the cache if images look outdated or corrupted — they will be re-fetched from
              RetroAchievements the next time they are displayed.
            </p>
            {cacheStatus === 'confirming' ? (
              <div className="gs-danger-confirm">
                <span className="gs-danger-warning">⚠️ This will delete all cached images. They will be re-downloaded as you browse.</span>
                <div className="gs-danger-confirm-btns">
                  <button type="button" className="gs-clear-btn" onClick={handleClearCache}>
                    Yes, Clear Cache
                  </button>
                  <button type="button" className="gs-update-btn" onClick={() => setCacheStatus('idle')}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : cacheStatus === 'clearing' ? (
              <button type="button" className="gs-clear-btn" disabled>Clearing...</button>
            ) : cacheStatus === 'done' ? (
              <div className="gs-danger-confirm">
                <span className="gs-danger-success">✅ Cleared {clearedCount} cached image{clearedCount !== 1 ? 's' : ''}.</span>
                <button type="button" className="gs-update-btn" onClick={() => setCacheStatus('idle')}>Dismiss</button>
              </div>
            ) : (
              <button type="button" className="gs-clear-btn" onClick={() => setCacheStatus('confirming')}>
                🗑️ Clear Image Cache
              </button>
            )}
          </div>
        </div>

        <div className="gs-footer">
          <button type="button" className="gs-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
