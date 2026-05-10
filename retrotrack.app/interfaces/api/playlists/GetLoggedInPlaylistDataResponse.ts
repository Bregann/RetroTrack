import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';

export interface GetLoggedInPlaylistDataResponse {
  id: string;
  name: string;
  description: string;
  numberOfLikes: number;
  numberOfGames: number;
  numberOfConsoles: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  icons: string[];
  totalGamesInPlaylist: number;
  totalPointsToEarn: number;
  totalAchievementsToEarn: number;
  totalAchievementsEarnedSoftcore: number;
  totalAchievementsEarnedHardcore: number;
  totalGamesBeatenSoftcore: number;
  totalGamesBeatenHardcore: number;
  totalGamesCompletedSoftcore: number;
  totalGamesMasteredHardcore: number;
  percentageBeaten: number;
  percentageMastered: number;
  percentageAchievementsGained: number;
  games: PlaylistGameItem[];
  isPlaylistOwner: boolean;
  isPublic: boolean;
  isLiked: boolean;
}

export interface PlaylistGameItem {
  orderIndex: number;
  gameId: number;
  title: string;
  consoleName: string;
  gameIconUrl: string;
  genre: string;
  achievementCount: number;
  points: number;
  players: number;
  medianTimeToBeatHardcoreSeconds: number | null;
  medianTimeToBeatHardcoreFormatted: string | null;
  medianTimeToMasterSeconds: number | null;
  medianTimeToMasterFormatted: string | null;
  highestAward: HighestAwardKind | null;
  achievementsEarnedSoftcore: number;
  achievementsEarnedHardcore: number;
}
