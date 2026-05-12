import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';

export interface GetUserProfileResponse {
  raUsername: string;
  lastUserUpdate: string;
  softcorePoints: number;
  hardcorePoints: number;
  gamesBeatenSoftcore: number;
  gamesBeatenHardcore: number;
  gamesCompleted: number;
  gamesMastered: number;
  achievementsEarnedSoftcore: number;
  achievementsEarnedHardcore: number;
  gamesInProgress: number;
  gamesBeatenWall: WallGame[];
  gamesMasteredWall: WallGame[];
  last5GamesPlayed: Last5GameInfo[];
  last5Awards: Last5GameInfo[];
  consoleProgressData: ConsoleProgressData[];
}

export interface WallGame {
  gameId: number;
  consoleName: string;
  title: string;
  imageUrl: string;
  dateAchieved: string;
  isHardcore: boolean;
  wallPosition: number;
  progressId: number;
}

export interface Last5GameInfo {
  gameId: number;
  title: string;
  imageUrl: string;
  datePlayed: string;
  totalGameAchievements: number;
  totalGamePoints: number;
  achievementsUnlockedSoftcore: number;
  achievementsUnlockedHardcore: number;
  highestAward: HighestAwardKind | null;
}

export interface ConsoleProgressData {
  consoleId: number;
  consoleName: string;
  consoleType: number;
  totalGames: number;
  completedGames: number;
  percentage: number;
}
