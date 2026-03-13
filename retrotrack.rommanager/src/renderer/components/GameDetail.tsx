import { useState } from 'react';
import {
  getGameById,
  getGameDetail,
  getCategoriesForGame,
  type GameDetail as GameDetailType,
} from '../mockData';
import AchievementOverlay from './AchievementOverlay';
import GameDetailHero from './game-detail/GameDetailHero';
import GameDetailActionBar from './game-detail/GameDetailActionBar';
import GameDetailAchievementsPreview from './game-detail/GameDetailAchievementsPreview';
import GameDetailAbout from './game-detail/GameDetailAbout';
import GameDetailCarousel from './game-detail/GameDetailCarousel';

interface GameDetailProps {
  gameId: number;
  onBack: () => void;
}

export default function GameDetailPage({ gameId, onBack }: GameDetailProps) {
  const [showAchievements, setShowAchievements] = useState(false);

  const game = getGameById(gameId);
  const detail = getGameDetail(gameId);
  const categories = getCategoriesForGame(gameId);

  if (!game) {
    return (
      <div className="game-detail-container">
        <button type="button" className="gd-back-btn" onClick={onBack}>
          ← Back to Library
        </button>
        <div className="gd-not-found">Game not found.</div>
      </div>
    );
  }

  const info: GameDetailType = detail || {
    gameId: game.id,
    description: `${game.title} is a classic ${game.console} game. Detailed information will be available when connected to the game database.`,
    developer: 'Unknown',
    publisher: 'Unknown',
    releaseDate: 'Unknown',
    genre: 'Unknown',
    players: '1 Player',
    hoursPlayed: 0,
    headerColor: game.coverColor,
    screenshotColors: [],
    achievements: [],
  };

  const unlockedCount = info.achievements.filter((a) => a.unlocked).length;
  const totalCount = info.achievements.length;
  const achievementPct =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="game-detail-container">
      <GameDetailHero
        game={game}
        headerColor={info.headerColor}
        categories={categories}
        onBack={onBack}
      />

      <GameDetailActionBar
        game={game}
        hoursPlayed={info.hoursPlayed}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        achievementPct={achievementPct}
        onShowAchievements={() => setShowAchievements(true)}
      />

      <div className="gd-content">
        <GameDetailAchievementsPreview
          achievements={info.achievements}
          unlockedCount={unlockedCount}
          totalCount={totalCount}
          onShowAll={() => setShowAchievements(true)}
        />

        <GameDetailAbout
          description={info.description}
          developer={info.developer}
          publisher={info.publisher}
          releaseDate={info.releaseDate}
          genre={info.genre}
          consoleName={game.console}
          players={info.players}
        />

        <GameDetailCarousel screenshotColors={info.screenshotColors} />
      </div>

      {showAchievements && (
        <AchievementOverlay
          achievements={info.achievements}
          gameTitle={game.title}
          onClose={() => setShowAchievements(false)}
        />
      )}
    </div>
  );
}
