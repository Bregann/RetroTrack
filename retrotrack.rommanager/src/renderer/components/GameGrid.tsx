import React from 'react';
import {
  GAMES,
  CONSOLES,
  CUSTOM_CATEGORIES,
  PLAYLISTS,
  getTrackedGames,
  getGamesByConsole,
  getGameById,
  getInProgressGames,
  type Game,
} from '../mockData';

interface GameGridProps {
  selectedView: string;
}

function GameCard({ game, size = 'normal' }: { game: Game; size?: 'normal' | 'small' }) {
  return (
    <div className={`game-card ${size}`}>
      <div
        className="game-card-cover"
        style={{ backgroundColor: game.coverColor }}
      >
        <span className="game-card-cover-text">{game.title}</span>
        {game.lastPlayed && (
          <span className="game-card-last-played">
            Last Played {game.lastPlayed}
          </span>
        )}
        {game.consoleShort && (
          <span className="game-card-console-badge">{game.consoleShort}</span>
        )}
      </div>
      <div className="game-card-info">
        <span className="game-card-title">{game.title}</span>
        {game.achievementPercent !== undefined && (
          <div className="game-card-achievement">
            <div className="achievement-bar">
              <div
                className="achievement-bar-fill"
                style={{ width: `${game.achievementPercent}%` }}
              />
            </div>
            <span className="achievement-text">
              {game.achievementPercent === 100
                ? '✅ Complete'
                : `Achievement: ${game.achievementPercent}%`}
            </span>
          </div>
        )}
        {game.lastPlayed && !game.achievementPercent && (
          <span className="game-card-meta">Last Played: {game.lastPlayed}</span>
        )}
      </div>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="section-header">
      <h2>
        {title}
        {count !== undefined && <span className="section-count"> ({count} GAMES)</span>}
      </h2>
      <button type="button" className="section-filter-btn" title="Filter">
        ⚙️
      </button>
    </div>
  );
}

export default function GameGrid({ selectedView }: GameGridProps) {
  // Determine what to show
  if (selectedView === 'home' || selectedView === '') {
    return <HomeView />;
  }

  // Console view
  const consoleMatch = selectedView.match(/^console-(.+)$/);
  if (consoleMatch) {
    const shortName = consoleMatch[1];
    const consoleInfo = CONSOLES.find((c) => c.shortName === shortName);
    if (consoleInfo) {
      const games = getGamesByConsole(consoleInfo.name);
      return (
        <div className="game-grid-container">
          <SectionHeader title={`CONSOLES: ${consoleInfo.name}`} count={games.length} />
          <div className="game-grid">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      );
    }
  }

  // Category view
  const catMatch = selectedView.match(/^cat-(\d+)$/);
  if (catMatch) {
    const cat = CUSTOM_CATEGORIES.find((c) => c.id === Number(catMatch[1]));
    if (cat) {
      const games = cat.gameIds.map((id) => getGameById(id)).filter(Boolean) as Game[];
      return (
        <div className="game-grid-container">
          <SectionHeader title={`${cat.icon} ${cat.name}`} count={games.length} />
          <div className="game-grid">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      );
    }
  }

  // Playlist view
  const plMatch = selectedView.match(/^playlist-(\d+)$/);
  if (plMatch) {
    const pl = PLAYLISTS.find((p) => p.id === Number(plMatch[1]));
    if (pl) {
      const games = pl.gameIds.map((id) => getGameById(id)).filter(Boolean) as Game[];
      return (
        <div className="game-grid-container">
          <SectionHeader title={`${pl.icon} ${pl.name}`} count={games.length} />
          <div className="game-grid">
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </div>
      );
    }
  }

  return <HomeView />;
}

function HomeView() {
  const trackedGames = getTrackedGames();
  const totalGames = GAMES.length;

  return (
    <div className="game-grid-container">
      {/* My Tracked Games Section */}
      <SectionHeader title="MY TRACKED GAMES" />
      <div className="game-grid game-grid-featured">
        {trackedGames.slice(0, 3).map((g) => (
          <GameCard key={g.id} game={g} size="normal" />
        ))}
      </div>

      {/* All games per console */}
      {CONSOLES.map((console) => {
        const games = getGamesByConsole(console.name);
        return (
          <div key={console.name}>
            <SectionHeader title={`CONSOLES: ${console.name}`} />
            <div className="game-grid">
              {games.map((g) => (
                <GameCard key={g.id} game={g} size="small" />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
