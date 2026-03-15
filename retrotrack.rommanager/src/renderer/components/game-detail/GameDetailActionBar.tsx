import { useState } from 'react';

interface GameSummary {
  status?: 'in-progress' | 'completed' | 'not-started';
  lastPlayed?: string;
}

interface Props {
  game: GameSummary;
  gameTracked: boolean;
  onTrackToggle: () => void;
  hoursPlayed: number;
  unlockedCount: number;
  totalCount: number;
  achievementPct: number;
  onShowAchievements: () => void;
}

export default function GameDetailActionBar({
  game,
  gameTracked,
  onTrackToggle,
  hoursPlayed,
  unlockedCount,
  totalCount,
  achievementPct,
  onShowAchievements,
}: Props) {
  const [trackHovered, setTrackHovered] = useState(false);

  const statusLabel =
    game.status === 'in-progress'
      ? 'In Progress'
      : game.status === 'completed'
        ? 'Completed'
        : 'Not Started';

  return (
    <div className="gd-action-bar">
      <button type="button" className="gd-play-btn">
        Play
      </button>
      <button
        type="button"
        className={`gd-track-btn ${gameTracked ? 'is-tracked' : ''}`}
        onClick={onTrackToggle}
        onMouseEnter={() => setTrackHovered(true)}
        onMouseLeave={() => setTrackHovered(false)}
      >
        {gameTracked
          ? trackHovered ? '✕ Untrack' : '✓ Tracked'
          : '+ Track Game'}
      </button>
      <div className="gd-action-divider" />
      <div className="gd-action-stat">
        <span className="gd-action-stat-label">Last Played</span>
        <span className="gd-action-stat-value">{game.lastPlayed || 'Never'}</span>
      </div>
      <div className="gd-action-stat">
        <span className="gd-action-stat-label">Hours</span>
        <span className="gd-action-stat-value">
          {hoursPlayed > 0 ? `${hoursPlayed}h` : '—'}
        </span>
      </div>
      <div className="gd-action-stat">
        <span className="gd-action-stat-label">Status</span>
        <span className={`gd-action-stat-value gd-status-${game.status || 'not-started'}`}>
          {statusLabel}
        </span>
      </div>
      {totalCount > 0 && (
        <div className="gd-action-stat clickable" onClick={onShowAchievements}>
          <span className="gd-action-stat-label">Achievements</span>
          <span className="gd-action-stat-value">
            {unlockedCount}/{totalCount} ({achievementPct}%)
          </span>
        </div>
      )}
    </div>
  );
}
