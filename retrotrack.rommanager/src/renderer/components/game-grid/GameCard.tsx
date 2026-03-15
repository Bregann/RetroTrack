import type { LibraryTrackedGame } from '../../helpers/libraryTypes';
import { raImageUrl } from '../../helpers/imageUrl';

interface GameCardProps {
  game: LibraryTrackedGame;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function GameCard({ game, onClick, onContextMenu }: GameCardProps) {
  const coverUrl = raImageUrl(game.imageBoxArt) ?? raImageUrl(game.imageIcon);

  return (
    <button type="button" className="game-card" onClick={onClick} onContextMenu={onContextMenu}>
      <div className="game-card-cover">
        {coverUrl
          ? <img src={coverUrl} alt={game.title} />
          : <span className="game-card-cover-text">{game.title}</span>
        }
        {game.consoleName && (
          <span className="game-card-console-badge">{game.consoleName}</span>
        )}
      </div>
      <div className="game-card-info">
        <span className="game-card-title">{game.title}</span>
        {game.achievementCount > 0 && (
          <div className="game-card-achievement">
            <div className="achievement-bar">
              <div
                className="achievement-bar-fill"
                style={{ width: `${game.percentageComplete}%` }}
              />
            </div>
            <span className="achievement-text">
              {game.percentageComplete === 100
                ? '✅ Complete'
                : `${game.achievementsEarned}/${game.achievementCount} achievements`}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
