import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';

export interface GetUserProgressForConsoleResponse {
  totalCount: number;
  totalPages: number;
  games: LoggedInConsoleGame[];
  consoleName: string;
  totalPointsToEarn: number;
  totalAchievementsToEarn: number;
  totalAchievementsEarnedSoftcore: number;
  totalAchievementsEarnedHardcore: number;
  totalGamesBeatenSoftcore: number;
  totalGamesBeatenHardcore: number;
  totalGamesCompletedSoftcore: number;
  totalGamesMasteredHardcore: number;
}

export interface LoggedInConsoleGame {
  gameId: number;
  gameTitle: string;
  gameGenre: string;
  achievementCount: number;
  achievementsUnlocked: number;
  percentageComplete: number;
  playerCount: number;
  gameImageUrl: string;
  points: number;
  consoleName: string | null;
  highestAward: HighestAwardKind | null;
  medianTimeToBeatHardcoreSeconds: number | null;
  medianTimeToBeatHardcoreFormatted: string | null;
  medianTimeToMasterSeconds: number | null;
  medianTimeToMasterFormatted: string | null;
}
