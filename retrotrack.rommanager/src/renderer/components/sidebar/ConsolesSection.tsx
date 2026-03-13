import { useState } from 'react';
import { CONSOLES, getGamesByConsole } from '../../mockData';
import GameContextMenu from '../GameContextMenu';

interface Props {
  selectedView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ConsolesSection({
  selectedView,
  onSelectView,
  collapsed,
  onToggleCollapse,
}: Props) {
  const [expandedConsoles, setExpandedConsoles] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{ gameId: number; x: number; y: number } | null>(null);

  const toggleConsole = (shortName: string) => {
    setExpandedConsoles((prev) => ({ ...prev, [shortName]: !prev[shortName] }));
  };

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
          onClick={() => onSelectView('consoles')}
        >
          CONSOLES
        </button>
      </h3>
      {!collapsed && CONSOLES.map((c) => {
        const consoleGames = getGamesByConsole(c.name);
        const isExpanded = expandedConsoles[c.shortName];
        return (
          <div key={c.shortName}>
            <div
              className={`sidebar-item ${selectedView === `console-${c.shortName}` ? 'active' : ''}`}
              style={{ cursor: 'default' }}
            >
              <span className="sidebar-item-icon">{c.icon}</span>
              <button
                type="button"
                className="sidebar-console-name"
                onClick={() => onSelectView(`console-${c.shortName}`)}
              >
                {c.name}
              </button>
              <button
                type="button"
                className="sidebar-expand-btn"
                onClick={() => toggleConsole(c.shortName)}
              >
                <span className="sidebar-expand-icon">
                  {isExpanded ? '▾' : '▸'}
                </span>
              </button>
            </div>
            {isExpanded && (
              <div className="sidebar-sub-items">
                {consoleGames.map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    className={`sidebar-sub-item ${selectedView === `game-${game.id}` ? 'active' : ''}`}
                    onClick={() => onSelectView(`game-${game.id}`)}
                    onContextMenu={(e) => openContextMenu(e, game.id)}
                  >
                    {game.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
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
