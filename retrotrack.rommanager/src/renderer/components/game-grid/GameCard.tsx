import type { Game } from '../../mockData';

interface GameCardProps {
  game: Game;
  onClick?: () => void;
}

export default function GameCard({ game, onClick }: GameCardProps) {
  return (
    <button type="button" className="game-card" onClick={onClick}>
      <div className="game-card-cover" style={{ backgroundColor: game.coverColor }}>
        <span className="game-card-cover-text">{game.title}</span>
        {game.lastPlayed && (
          <span className="game-card-last-played">Last Played {game.lastPlayed}</span>
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
        {game.lastPlayed && game.achievementPercent === undefined && (
          <span className="game-card-meta">Last Played: {game.lastPlayed}</span>
        )}
      </div>
    </button>
  );
}
