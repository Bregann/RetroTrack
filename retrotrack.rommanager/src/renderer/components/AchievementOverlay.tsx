import React, { useState } from 'react';
import type { Achievement } from '../helpers/achievementTypes';

interface AchievementOverlayProps {
  achievements: Achievement[];
  gameTitle: string;
  onClose: () => void;
}

type Filter = 'all' | 'unlocked' | 'locked' | 'missable' | 'progression' | 'win';

export default function AchievementOverlay({
  achievements,
  gameTitle,
  onClose,
}: AchievementOverlayProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const unlocked    = achievements.filter((a) => a.unlocked);
  const missable    = achievements.filter((a) => a.type === 'missable');
  const progression = achievements.filter((a) => a.type === 'progression');
  const winCond     = achievements.filter((a) => a.type === 'win');
  const totalPoints  = achievements.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = unlocked.reduce((sum, a) => sum + a.points, 0);

  const filtered =
    filter === 'all'         ? achievements :
    filter === 'unlocked'    ? achievements.filter((a) => a.unlocked) :
    filter === 'locked'      ? achievements.filter((a) => !a.unlocked) :
    filter === 'missable'    ? achievements.filter((a) => a.type === 'missable') :
    filter === 'progression' ? achievements.filter((a) => a.type === 'progression') :
                               achievements.filter((a) => a.type === 'win');

  const filterTabs: { key: Filter; label: string }[] = [
    { key: 'all',         label: `All (${achievements.length})` },
    { key: 'unlocked',    label: `Unlocked (${unlocked.length})` },
    { key: 'locked',      label: `Locked (${achievements.length - unlocked.length})` },
    { key: 'missable',    label: `⚠ Missable (${missable.length})` },
    { key: 'progression', label: `✅ Progression (${progression.length})` },
    { key: 'win',         label: `🏆 Win Conditions (${winCond.length})` },
  ];

  return (
    <div className="achievement-overlay-backdrop" onClick={onClose}>
      <div
        className="achievement-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="achievement-overlay-header">
          <div>
            <h2>Achievements</h2>
            <p className="achievement-overlay-subtitle">{gameTitle}</p>
          </div>
          <button
            type="button"
            className="achievement-overlay-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="achievement-overlay-summary">
          <div className="achievement-summary-stat">
            <span className="summary-stat-value">{unlocked.length}/{achievements.length}</span>
            <span className="summary-stat-label">Unlocked</span>
          </div>
          <div className="achievement-summary-stat">
            <span className="summary-stat-value">
              {Math.round((unlocked.length / achievements.length) * 100)}%
            </span>
            <span className="summary-stat-label">Complete</span>
          </div>
          <div className="achievement-summary-stat">
            <span className="summary-stat-value">{earnedPoints}/{totalPoints}</span>
            <span className="summary-stat-label">Points</span>
          </div>
          <div className="achievement-summary-stat">
            <span className="summary-stat-value ach-stat-missable">{missable.length}</span>
            <span className="summary-stat-label">Missable</span>
          </div>
          <div className="achievement-summary-stat">
            <span className="summary-stat-value ach-stat-progression">{progression.length}</span>
            <span className="summary-stat-label">Progression</span>
          </div>
          <div className="achievement-summary-stat">
            <span className="summary-stat-value ach-stat-win">{winCond.length}</span>
            <span className="summary-stat-label">Win Cond.</span>
          </div>
        </div>

        <div className="achievement-overlay-filters">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`achievement-filter-btn filter-${key} ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="achievement-overlay-list">
          {filtered.map((ach) => (
            <div
              key={ach.id}
              className={[
                'achievement-item',
                ach.unlocked ? 'unlocked' : 'locked',
                ach.type === 'missable' ? 'missable' : '',
                ach.type === 'win'      ? 'win-cond' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className={`achievement-item-icon ${!ach.unlocked ? 'locked-icon' : ''}`}>
                {ach.icon}
              </div>
              <div className="achievement-item-info">
                <div className="achievement-item-top">
                  <span className="achievement-item-title">{ach.title}</span>
                  {ach.type === 'missable' && (
                    <span className="ach-type-badge ach-type-missable" title="Missable">⚠ Missable</span>
                  )}
                  {ach.type === 'progression' && (
                    <span className="ach-type-badge ach-type-progression" title="Progression">✅ Progression</span>
                  )}
                  {ach.type === 'win' && (
                    <span className="ach-type-badge ach-type-win" title="Win Condition">★ Win</span>
                  )}
                </div>
                <p className="achievement-item-desc">{ach.description}</p>
                {ach.unlocked && ach.unlockedDate && (
                  <span className="achievement-item-date">Unlocked {ach.unlockedDate}</span>
                )}
              </div>
              <div className="achievement-item-right">
                <div className="achievement-item-points">
                  <span>{ach.points}</span>
                  <span className="points-label">pts</span>
                </div>
                {ach.unlocked && <span className="ach-check-icon">✓</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

