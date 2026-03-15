import { useLibraryData } from '../../helpers/useLibraryData';
import { useScannedGameIds, useScannedConsoleIds, useScannedGamesAsLibrary } from '../../helpers/useScannedGames';
import { getConsoleTypeIcon } from '../../enums/consoleType';
import GameCard from './GameCard';
import { SectionHeader } from './GameSection';

interface HomeViewProps {
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
  onGameContextMenu?: (e: React.MouseEvent, gameId: number) => void;
}

export default function HomeView({ onGameClick, onSelectView, onGameContextMenu }: HomeViewProps) {
  const { data: libraryData } = useLibraryData();
  const scannedGameIds = useScannedGameIds();
  const scannedConsoleIds = useScannedConsoleIds();
  const scannedGames = useScannedGamesAsLibrary();

  const allTracked = libraryData?.trackedGames ?? [];
  const consoles = libraryData?.consoles ?? [];
  const playlists = libraryData?.playlists ?? [];

  // Only show games that have a scanned ROM
  const trackedGames = allTracked.filter((g) => scannedGameIds.has(g.gameId));

  // Merge scanned games with tracked data — tracked takes priority (has progress)
  const trackedMap = new Map(trackedGames.map((g) => [g.gameId, g]));
  const allGames = scannedGames.map((g) => trackedMap.get(g.gameId) ?? g);

  // Most recently added = last N by position in the list
  const recentlyAdded = allGames.slice(0, 6);
  // In-progress games sorted by completion desc
  const inProgress = trackedGames
    .filter((g) => g.achievementsEarned > 0 && g.percentageComplete < 100)
    .sort((a, b) => b.percentageComplete - a.percentageComplete)
    .slice(0, 6);

  const hasAnything = allGames.length > 0;

  if (!hasAnything) {
    return (
      <div className="game-grid-container">
        <div className="empty-library">
          <div className="empty-library__icon">🎮</div>
          <h2 className="empty-library__title">No games in your library yet</h2>
          <p className="empty-library__desc">
            Scan a folder of ROMs to get started. RetroTrack will match your files against
            RetroAchievements and add recognised games here.
          </p>
          <p className="empty-library__hint">
            Go to <strong>Library → Add Folder</strong> to scan your ROMs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-grid-container">
      {inProgress.length > 0 && (
        <>
          <SectionHeader title="IN PROGRESS" />
          <div className="game-grid">
            {inProgress.map((g) => (
              <GameCard
                key={g.gameId}
                game={g}
                onClick={() => onGameClick?.(g.gameId)}
                onContextMenu={(e) => { e.preventDefault(); onGameContextMenu?.(e, g.gameId); }}
              />
            ))}
          </div>
        </>
      )}

      {recentlyAdded.length > 0 && (
        <>
          <SectionHeader title="RECENTLY ADDED" />
          <div className="game-grid">
            {recentlyAdded.map((g) => (
              <GameCard
                key={g.gameId}
                game={g}
                onClick={() => onGameClick?.(g.gameId)}
                onContextMenu={(e) => { e.preventDefault(); onGameContextMenu?.(e, g.gameId); }}
              />
            ))}
          </div>
        </>
      )}

      {consoles.length > 0 && (
        <>
          <SectionHeader title="CONSOLES" />
          <div className="browse-card-grid">
            {consoles.map((c) => {
              const hasGames = scannedConsoleIds.has(c.consoleId);
              const count = trackedGames.filter((g) => g.consoleId === c.consoleId).length;
              return (
                <button
                  key={c.consoleId}
                  type="button"
                  className={`browse-card ${!hasGames ? 'browse-card--disabled' : ''}`}
                  title={!hasGames ? 'No games are scanned for this console' : undefined}
                  onClick={() => hasGames && onSelectView?.(`console-${c.consoleId}`)}
                  style={!hasGames ? { cursor: 'default' } : undefined}
                >
                  <span className="browse-card-icon">{getConsoleTypeIcon(c.consoleType)}</span>
                  <span className="browse-card-name">{c.consoleName}</span>
                  <span className="browse-card-meta">{count} games</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {playlists.length > 0 && (
        <>
          <SectionHeader title="PLAYLISTS" />
          <div className="browse-card-grid">
            {playlists.map((pl) => (
              <button
                key={pl.playlistId}
                type="button"
                className="browse-card"
                onClick={() => onSelectView?.(`playlist-${pl.playlistId}`)}
              >
                <span className="browse-card-icon">{pl.icon}</span>
                <span className="browse-card-name">{pl.name}</span>
                <span className="browse-card-meta">{pl.gameIds.length} games</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
