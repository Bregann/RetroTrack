import { useLibraryData } from '../../helpers/useLibraryData';
import { getConsoleTypeIcon } from '../../enums/consoleType';
import GameCard from './GameCard';
import { SectionHeader } from './GameSection';

interface HomeViewProps {
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
}

export default function HomeView({ onGameClick, onSelectView }: HomeViewProps) {
  const { data: libraryData } = useLibraryData();
  const trackedGames = libraryData?.trackedGames ?? [];
  const consoles = libraryData?.consoles ?? [];
  const playlists = libraryData?.playlists ?? [];

  // Most recently added = last N by position in the list
  const recentlyAdded = trackedGames.slice(0, 6);
  // In-progress games sorted by completion desc
  const inProgress = trackedGames
    .filter((g) => g.achievementsEarned > 0 && g.percentageComplete < 100)
    .sort((a, b) => b.percentageComplete - a.percentageComplete)
    .slice(0, 6);

  return (
    <div className="game-grid-container">
      {inProgress.length > 0 && (
        <>
          <SectionHeader title="IN PROGRESS" />
          <div className="game-grid">
            {inProgress.map((g) => (
              <GameCard key={g.gameId} game={g} onClick={() => onGameClick?.(g.gameId)} />
            ))}
          </div>
        </>
      )}

      {recentlyAdded.length > 0 && (
        <>
          <SectionHeader title="RECENTLY ADDED" />
          <div className="game-grid">
            {recentlyAdded.map((g) => (
              <GameCard key={g.gameId} game={g} onClick={() => onGameClick?.(g.gameId)} />
            ))}
          </div>
        </>
      )}

      {consoles.length > 0 && (
        <>
          <SectionHeader title="CONSOLES" />
          <div className="browse-card-grid">
            {consoles.map((c) => {
              const count = trackedGames.filter((g) => g.consoleId === c.consoleId).length;
              return (
                <button
                  key={c.consoleId}
                  type="button"
                  className="browse-card"
                  onClick={() => onSelectView?.(`console-${c.consoleId}`)}
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
