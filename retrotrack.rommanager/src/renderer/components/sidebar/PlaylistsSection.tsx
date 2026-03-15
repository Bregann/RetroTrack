import { useState } from 'react';
import { useLibraryData } from '../../helpers/useLibraryData';
import { useScannedGameIds } from '../../helpers/useScannedGames';
import { raImageUrl } from '../../helpers/imageUrl';
import Tooltip from '../Tooltip';

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
  const { data } = useLibraryData();
  const scannedGameIds = useScannedGameIds();
  const playlists = Array.isArray(data?.playlists) ? data.playlists : [];
  const allTrackedGames = data?.trackedGames ?? [];
  const [expandedPlaylists, setExpandedPlaylists] = useState<Record<string, boolean>>({});

  const togglePlaylist = (id: string) => {
    setExpandedPlaylists((prev) => ({ ...prev, [id]: !prev[id] }));
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
        <span className="sidebar-section-count">{playlists.length}</span>
      </h3>
      {!collapsed && playlists.map((pl) => {
        const isExpanded = expandedPlaylists[pl.playlistId];
        return (
          <div key={pl.playlistId}>
            <div
              className={`sidebar-item ${selectedView === `playlist-${pl.playlistId}` ? 'active' : ''}`}
              style={{ cursor: 'default' }}
            >
              <button
                type="button"
                className="sidebar-console-name"
                onClick={() => onSelectView(`playlist-${pl.playlistId}`)}
              >
                {pl.name}
              </button>
              <button
                type="button"
                className="sidebar-expand-btn"
                onClick={() => togglePlaylist(pl.playlistId)}
              >
                <span className="sidebar-expand-icon">
                  {isExpanded ? '▾' : '▸'}
                </span>
              </button>
            </div>
            {isExpanded && (
              <div className="sidebar-sub-items">
                {pl.gameIds.map((gid) => {
                  const game = allTrackedGames.find((g) => g.gameId === gid);
                  if (!game) return null;
                  const isScanned = scannedGameIds.has(gid);
                  const iconUrl = raImageUrl(game.imageIcon);
                  const btn = (
                    <button
                      key={gid}
                      type="button"
                      className={`sidebar-sub-item${!isScanned ? ' sidebar-sub-item--unscanned' : ''}${selectedView === `game-${gid}` ? ' active' : ''}`}
                      onClick={isScanned ? () => onSelectView(`game-${gid}`) : undefined}
                    >
                      {iconUrl && <img src={iconUrl} alt="" className="sidebar-game-icon" />}
                      <span className="sidebar-game-title">{game.title}</span>
                    </button>
                  );
                  return isScanned ? btn : (
                    <Tooltip key={gid} text="Game not found — scan a folder containing this ROM">
                      {btn}
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
