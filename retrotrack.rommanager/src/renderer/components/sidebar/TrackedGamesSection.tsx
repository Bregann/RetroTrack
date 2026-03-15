import { useState } from 'react';
import { useLibraryData } from '../../helpers/useLibraryData';
import { useScannedGameIds } from '../../helpers/useScannedGames';
import { raImageUrl } from '../../helpers/imageUrl';
import GameContextMenu from '../GameContextMenu';
import Tooltip from '../Tooltip';

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
  const { data } = useLibraryData();
  const scannedGameIds = useScannedGameIds();
  const trackedGames = data?.trackedGames ?? [];
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
        <span className="sidebar-section-count">{trackedGames.length}</span>
      </h3>
      {!collapsed && trackedGames.map((game) => {
        const isScanned = scannedGameIds.has(game.gameId);
        const iconUrl = raImageUrl(game.imageIcon);
        const btn = (
          <button
            key={game.gameId}
            type="button"
            className={`sidebar-sub-item sidebar-tracked-game${!isScanned ? ' sidebar-sub-item--unscanned' : ''}${selectedView === `game-${game.gameId}` ? ' active' : ''}`}
            onClick={isScanned ? () => onSelectView(`game-${game.gameId}`) : undefined}
            onContextMenu={isScanned ? (e) => openContextMenu(e, game.gameId) : undefined}
          >
            {iconUrl && <img src={iconUrl} alt="" className="sidebar-game-icon" />}
            <span className="sidebar-game-title">{game.title}</span>
          </button>
        );
        return isScanned ? btn : (
          <Tooltip key={game.gameId} text="Game not found — scan a folder containing this ROM">
            {btn}
          </Tooltip>
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
