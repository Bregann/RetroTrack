import type { Game } from '../../mockData';

interface Props {
  game: Game;
  headerColor: string;
  categories: string[];
  onBack: () => void;
}

export default function GameDetailHero({ game, headerColor, categories, onBack }: Props) {
  return (
    <div className="gd-hero" style={{ backgroundColor: headerColor }}>
      <button type="button" className="gd-back-btn" onClick={onBack}>
        ← Back to Library
      </button>
      <div className="gd-hero-content">
        <h1 className="gd-hero-title">{game.title}</h1>
        <span className="gd-hero-console">{game.console}</span>
      </div>
      {categories.length > 0 && (
        <div className="gd-hero-categories">
          {categories.map((cat) => (
            <span key={cat} className="gd-hero-category-tag">
              {cat}
            </span>
          ))}
        </div>
      )}
      {game.favorite && (
        <span className="gd-hero-fav-badge">★ Favorite</span>
      )}
    </div>
  );
}
