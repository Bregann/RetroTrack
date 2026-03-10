import React, { useState } from 'react';
import {
  CONSOLES,
  CUSTOM_CATEGORIES,
  PLAYLISTS,
  MOCK_USER,
  getTrackedGames,
  getInProgressGames,
  getGameById,
  type Game,
} from '../mockData';

interface SidebarProps {
  selectedView: string;
  onSelectView: (view: string) => void;
}

export default function Sidebar({ selectedView, onSelectView }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  const trackedGames = getTrackedGames();
  const inProgressGames = getInProgressGames();

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="sidebar">
      <div className="sidebar-scroll">
        {/* My Tracked Games */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            MY TRACKED GAMES <span className="badge-info">(Hard Coded)</span>
          </h3>
          {trackedGames.map((game) => (
            <button
              key={game.id}
              type="button"
              className={`sidebar-item ${selectedView === `game-${game.id}` ? 'active' : ''}`}
              onClick={() => onSelectView(`game-${game.id}`)}
            >
              <span className="sidebar-item-status">
                {game.status === 'in-progress' ? '🟢' : '⚪'}
              </span>
              <span className="sidebar-item-label">
                {game.status === 'in-progress' ? `In Progress: ${game.title}` : game.title}
              </span>
              {game.title === 'Sonic the Hedgehog' && (
                <span className="sidebar-item-badges">🥇🥇🥈🥉🥉</span>
              )}
            </button>
          ))}
          <button
            type="button"
            className={`sidebar-item ${selectedView === 'last-played' ? 'active' : ''}`}
            onClick={() => onSelectView('last-played')}
          >
            <span className="sidebar-item-status">▶️</span>
            <span className="sidebar-item-label">Last Played: Zelda: Ocarina of Time</span>
          </button>
        </div>

        {/* Consoles */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            CONSOLES <span className="badge-info">(Hard Coded)</span>
          </h3>
          {CONSOLES.map((c) => (
            <button
              key={c.name}
              type="button"
              className={`sidebar-item ${selectedView === `console-${c.shortName}` ? 'active' : ''}`}
              onClick={() => onSelectView(`console-${c.shortName}`)}
            >
              <span className="sidebar-item-icon">{c.icon}</span>
              <span className="sidebar-item-label">{c.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Categories */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            CUSTOM CATEGORIES <span className="badge-info">(Expandable)</span>
            <button type="button" className="sidebar-collapse-btn" title="Collapse">▾</button>
          </h3>
          {CUSTOM_CATEGORIES.map((cat) => (
            <div key={cat.id}>
              <button
                type="button"
                className={`sidebar-item ${selectedView === `cat-${cat.id}` ? 'active' : ''}`}
                onClick={() => {
                  toggleCategory(cat.id);
                  onSelectView(`cat-${cat.id}`);
                }}
              >
                <span className="sidebar-item-icon">{cat.icon}</span>
                <span className="sidebar-item-label">{cat.name}</span>
                <span className="sidebar-expand-icon">
                  {expandedCategories[cat.id] ? '▾' : '▸'}
                </span>
              </button>
              {expandedCategories[cat.id] && (
                <div className="sidebar-sub-items">
                  {cat.gameIds.map((gid) => {
                    const game = getGameById(gid);
                    return game ? (
                      <button
                        key={gid}
                        type="button"
                        className="sidebar-sub-item"
                        onClick={() => onSelectView(`game-${gid}`)}
                      >
                        {game.title}
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Playlists */}
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">
            RETROTRACK PLAYLISTS <span className="badge-info">(Manage)</span>
          </h3>
          {PLAYLISTS.map((pl) => (
            <button
              key={pl.id}
              type="button"
              className={`sidebar-item ${selectedView === `playlist-${pl.id}` ? 'active' : ''}`}
              onClick={() => onSelectView(`playlist-${pl.id}`)}
            >
              <span className="sidebar-item-icon">{pl.icon}</span>
              <span className="sidebar-item-label">{pl.name}</span>
            </button>
          ))}
          <button
            type="button"
            className="sidebar-item sidebar-item-add"
            onClick={() => {}}
          >
            Create New Playlist
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="sidebar-profile">
        <div className="profile-card">
          <div
            className="profile-avatar"
            style={{ backgroundColor: MOCK_USER.avatarColor }}
          >
            {MOCK_USER.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-username">{MOCK_USER.username}</span>
            <span className="profile-achievements">
              Achievements Unlocked: {MOCK_USER.achievementsUnlocked.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="profile-edit-btn"
          onClick={() => {
            window.open('https://retrotrack.app/profile', '_blank');
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}
