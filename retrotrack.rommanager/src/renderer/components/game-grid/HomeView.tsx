import {
  CONSOLES,
  PLAYLISTS,
  getGamesByConsole,
  getRecentlyAdded,
  getRecentlyPlayed,
} from '../../mockData';
import GameCard from './GameCard';
import { SectionHeader } from './GameSection';

interface HomeViewProps {
  onGameClick?: (gameId: number) => void;
  onSelectView?: (view: string) => void;
}

export default function HomeView({ onGameClick, onSelectView }: HomeViewProps) {
  const recentlyPlayed = getRecentlyPlayed(6);
  const recentlyAdded = getRecentlyAdded(6);

  return (
    <div className="game-grid-container">
      {recentlyPlayed.length > 0 && (
        <>
          <SectionHeader title="RECENTLY PLAYED" />
          <div className="game-grid">
            {recentlyPlayed.map((g) => (
              <GameCard key={g.id} game={g} onClick={() => onGameClick?.(g.id)} />
            ))}
          </div>
        </>
      )}

      <SectionHeader title="RECENTLY ADDED" />
      <div className="game-grid">
        {recentlyAdded.map((g) => (
          <GameCard key={g.id} game={g} onClick={() => onGameClick?.(g.id)} />
        ))}
      </div>

      <SectionHeader title="CONSOLES" />
      <div className="browse-card-grid">
        {CONSOLES.map((c) => (
          <button
            key={c.shortName}
            type="button"
            className="browse-card"
            onClick={() => onSelectView?.(`console-${c.shortName}`)}
          >
            <span className="browse-card-icon">{c.icon}</span>
            <span className="browse-card-name">{c.name}</span>
            <span className="browse-card-meta">{getGamesByConsole(c.name).length} games</span>
          </button>
        ))}
      </div>

      <SectionHeader title="PLAYLISTS" />
      <div className="browse-card-grid">
        {PLAYLISTS.map((pl) => (
          <button
            key={pl.id}
            type="button"
            className="browse-card"
            onClick={() => onSelectView?.(`playlist-${pl.id}`)}
          >
            <span className="browse-card-icon">{pl.icon}</span>
            <span className="browse-card-name">{pl.name}</span>
            <span className="browse-card-meta">{pl.gameIds.length} games</span>
          </button>
        ))}
      </div>
    </div>
  );
}
