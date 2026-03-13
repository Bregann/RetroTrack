import { useState } from 'react';
import { PLAYLISTS, getGameById } from '../../mockData';
import GameContextMenu from '../GameContextMenu';

interface Props {
  selectedView: string;
  onSelectView: (view: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function PlaylistsSection({
  selectedView,
  onSelectView,
  collapsed,
  onToggleCollapse,
}: Props) {
  const [expandedPlaylists, setExpandedPlaylists] = useState<Record<number, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{ gameId: number; playlistId: number; x: number; y: number } | null>(null);

  const togglePlaylist = (id: number) => {
    setExpandedPlaylists((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openContextMenu = (e: React.MouseEvent, gameId: number, playlistId: number) => {
    e.preventDefault();
    setContextMenu({ gameId, playlistId, x: e.clientX, y: e.clientY });
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
          onClick={() => onSelectView('playlists')}
        >
          RETROTRACK PLAYLISTS
        </button>
      </h3>
      {!collapsed && PLAYLISTS.map((pl) => {
        const isExpanded = expandedPlaylists[pl.id];
        return (
          <div key={pl.id}>
            <div
              className={`sidebar-item ${selectedView === `playlist-${pl.id}` ? 'active' : ''}`}
              style={{ cursor: 'default' }}
            >
              <span className="sidebar-item-icon">{pl.icon}</span>
              <button
                type="button"
                className="sidebar-console-name"
                onClick={() => onSelectView(`playlist-${pl.id}`)}
              >
                {pl.name}
              </button>
              <button
                type="button"
                className="sidebar-expand-btn"
                onClick={() => togglePlaylist(pl.id)}
              >
                <span className="sidebar-expand-icon">
                  {isExpanded ? '▾' : '▸'}
                </span>
              </button>
            </div>
            {isExpanded && (
              <div className="sidebar-sub-items">
                {pl.gameIds.map((gid) => {
                  const game = getGameById(gid);
                  return game ? (
                    <button
                      key={gid}
                      type="button"
                      className={`sidebar-sub-item ${selectedView === `game-${gid}` ? 'active' : ''}`}
                      onClick={() => onSelectView(`game-${gid}`)}
                      onContextMenu={(e) => openContextMenu(e, gid, pl.id)}
                    >
                      {game.title}
                    </button>
                  ) : null;
                })}
              </div>
            )}
          </div>
        );
      })}
      {!collapsed && (
        <button
          type="button"
          className="sidebar-item sidebar-item-add"
          onClick={() => {}}
        >
          Create New Playlist
        </button>
      )}
      {contextMenu && (
        <GameContextMenu
          gameId={contextMenu.gameId}
          playlistId={contextMenu.playlistId}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
