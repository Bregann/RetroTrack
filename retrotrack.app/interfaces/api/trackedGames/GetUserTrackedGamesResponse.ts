import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';

export interface GetUserTrackedGamesResponse {
  totalCount: number;
  totalPages: number;
  games: LoggedInGame[];
}

export interface LoggedInGame {
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
  highestAward: HighestAwardKind;
  medianTimeToBeatHardcoreSeconds: number | null;
  medianTimeToBeatHardcoreFormatted: string | null;
  medianTimeToMasterSeconds: number | null;
  medianTimeToMasterFormatted: string | null;
}
