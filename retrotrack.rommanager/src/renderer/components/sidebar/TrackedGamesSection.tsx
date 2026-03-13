import { useState } from 'react';
import { getTrackedGames } from '../../mockData';
import GameContextMenu from '../GameContextMenu';

interface Props {
  selectedView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TrackedGamesSection({
  selectedView,
  onSelectView,
  collapsed,
  onToggleCollapse,
}: Props) {
  const trackedGames = getTrackedGames();
  const [contextMenu, setContextMenu] = useState<{ gameId: number; x: number; y: number } | null>(null);

  const openContextMenu = (e: React.MouseEvent, gameId: number) => {
    e.preventDefault();
    setContextMenu({ gameId, x: e.clientX, y: e.clientY });
  };

  return (
    <div className="sidebar-section">
      <h3 className="sidebar-section-title sidebar-section-toggle">
        <span
          className={`sidebar-chevron ${collapsed ? 'collapsed' : ''}`}
          onClick={onToggleCollapse}
          style={{ cursor: 'pointer' }}
        >▾</span>
        <button
          type="button"
          className="sidebar-console-name"
          style={{ textTransform: 'inherit', letterSpacing: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
          onClick={() => onSelectView('tracked')}
        >
          MY TRACKED GAMES
        </button>
      </h3>
      {!collapsed && trackedGames.map((game) => (
        <button
          key={game.id}
          type="button"
          className={`sidebar-sub-item sidebar-tracked-game ${selectedView === `game-${game.id}` ? 'active' : ''}`}
          onClick={() => onSelectView(`game-${game.id}`)}
          onContextMenu={(e) => openContextMenu(e, game.id)}
        >
          {game.title}
        </button>
      ))}
      {contextMenu && (
        <GameContextMenu
          gameId={contextMenu.gameId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
