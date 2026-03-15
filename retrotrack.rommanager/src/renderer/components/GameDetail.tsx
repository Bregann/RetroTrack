import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useGameDetail, type GameDetailAchievement, GAME_DETAIL_QUERY_KEY } from '../helpers/useGameDetail';
import { doPost, doDelete } from '../helpers/apiClient';
import { raImageUrl } from '../helpers/imageUrl';
import type { Achievement } from '../mockData';
import AchievementOverlay from './AchievementOverlay';
import EmulatorPickerModal from './game-detail/EmulatorPickerModal';
import GameDetailHero from './game-detail/GameDetailHero';
import GameDetailActionBar from './game-detail/GameDetailActionBar';
import GameDetailAchievementsPreview from './game-detail/GameDetailAchievementsPreview';
import GameDetailAbout from './game-detail/GameDetailAbout';
import GameDetailCarousel from './game-detail/GameDetailCarousel';

interface GameDetailProps {
  gameId: number;
  onBack: () => void;
}

/** Map an achievement type number from the API to the local string union */
function mapAchievementType(
  type: number | null,
): 'normal' | 'missable' | 'win' | undefined {
  if (type === null || type === undefined) return undefined;
  // AchievementType enum: 0 = Normal (progression), 1 = Win_Condition, 2 = Missable
  switch (type) {
    case 1:
      return 'win';
    case 2:
      return 'missable';
    default:
      return 'normal';
  }
}

/** Convert API achievement into the shape the presentational components use */
function toLocalAchievement(a: GameDetailAchievement): Achievement {
  const unlocked =
    a.dateEarnedSoftcore !== null || a.dateEarnedHardcore !== null;
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    icon: unlocked ? '🏆' : '🔒',
    unlocked,
    unlockedDate: a.dateEarnedHardcore ?? a.dateEarnedSoftcore ?? undefined,
    rarity: 'common', // rarity not provided by API — default
    points: a.points,
    type: mapAchievementType(a.type),
  };
}

function formatHoursPlayed(totalSeconds: number): number {
  return Math.round((totalSeconds / 3600) * 10) / 10;
}

function formatLastPlayed(utcDate: string | null): string | undefined {
  if (!utcDate) return undefined;
  const date = new Date(utcDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
}

export default function GameDetailPage({ gameId, onBack }: GameDetailProps) {
  const [showAchievements, setShowAchievements] = useState(false);
  const [showEmulatorPicker, setShowEmulatorPicker] = useState(false);
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useGameDetail(gameId);

  const trackMutation = useMutation({
    mutationFn: () => doPost(`/api/TrackedGames/AddTrackedGame/${gameId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-data'] });
      queryClient.setQueryData([GAME_DETAIL_QUERY_KEY, gameId], (old: typeof data) =>
        old ? { ...old, gameTracked: true } : old,
      );
    },
  });

  const untrackMutation = useMutation({
    mutationFn: () => doDelete(`/api/TrackedGames/DeleteTrackedGame/${gameId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['library-data'] });
      queryClient.setQueryData([GAME_DETAIL_QUERY_KEY, gameId], (old: typeof data) =>
        old ? { ...old, gameTracked: false } : old,
      );
    },
  });

  function handleTrackToggle() {
    if (!data) return;
    if (data.gameTracked) {
      untrackMutation.mutate();
    } else {
      trackMutation.mutate();
    }
  }

  if (isLoading) {
    return (
      <div className="game-detail-container">
        <button type="button" className="gd-back-btn" onClick={onBack}>
          ← Back to Library
        </button>
        <div className="gd-not-found">Loading...</div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="game-detail-container">
        <button type="button" className="gd-back-btn" onClick={onBack}>
          ← Back to Library
        </button>
        <div className="gd-not-found">Failed to load game details.</div>
      </div>
    );
  }

  const achievements = data.achievements
    .sort((a, b) => a.achievementOrder - b.achievementOrder)
    .map(toLocalAchievement);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const achievementPct =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const hoursPlayed = formatHoursPlayed(data.totalSecondsPlayed);

  // Determine completion status from API data
  const status: 'completed' | 'in-progress' | 'not-started' =
    data.dateMastered || data.dateCompleted
      ? 'completed'
      : unlockedCount > 0
        ? 'in-progress'
        : 'not-started';

  // Build a minimal Game-like object for the hero & action bar
  const gameSummary = {
    id: data.gameId,
    title: data.title,
    console: data.consoleName,
    consoleShort: '',
    coverColor: '#333',
    status,
    achievementPercent: achievementPct,
    lastPlayed: formatLastPlayed(data.lastPlayedUtc),
  };

  // Image carousel — build list of available images using the RA cache scheme
  const carouselImages = [
    { id: 1, label: 'Box Art',      path: data.imageBoxArt },
    { id: 2, label: 'Title Screen', path: data.imageTitle },
    { id: 3, label: 'In-Game',      path: data.imageInGame },
  ]
    .filter((img) => !!img.path)
    .map((img) => ({ id: img.id, label: img.label, url: raImageUrl(img.path)! }));

  // Description, release date, and banners don't exist in the API yet — use placeholders
  const description = `${data.title} is a ${data.consoleName} game. Detailed description will be available in a future update.`;
  const releaseDate = 'TBC';

  return (
    <div className="game-detail-container">
      <GameDetailHero
        game={gameSummary}
        headerColor="#333"
        categories={data.genre ? [data.genre] : []}
        onBack={onBack}
      />

      <GameDetailActionBar
        game={gameSummary}
        gameTracked={data.gameTracked}
        onTrackToggle={handleTrackToggle}
        hoursPlayed={hoursPlayed}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        achievementPct={achievementPct}
        onShowAchievements={() => setShowAchievements(true)}
        onPlay={() => setShowEmulatorPicker(true)}
      />

      <div className="gd-content">
        <GameDetailAchievementsPreview
          achievements={achievements}
          unlockedCount={unlockedCount}
          totalCount={totalCount}
          onShowAll={() => setShowAchievements(true)}
        />

        <GameDetailAbout
          description={description}
          developer={data.developer}
          publisher={data.publisher}
          releaseDate={releaseDate}
          genre={data.genre}
          consoleName={data.consoleName}
          players={data.players > 0 ? `${data.players} Player${data.players > 1 ? 's' : ''}` : 'Unknown'}
        />

        <GameDetailCarousel images={carouselImages} />
      </div>

      {showAchievements && (
        <AchievementOverlay
          achievements={achievements}
          gameTitle={data.title}
          onClose={() => setShowAchievements(false)}
        />
      )}

      {showEmulatorPicker && (
        <EmulatorPickerModal
          gameId={data.gameId}
          gameTitle={data.title}
          consoleId={data.consoleId}
          consoleName={data.consoleName}
          imageIcon={data.gameImage}
          onClose={() => setShowEmulatorPicker(false)}
        />
      )}
    </div>
  );
}
