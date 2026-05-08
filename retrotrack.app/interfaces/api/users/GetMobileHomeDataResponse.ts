import { DayData } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse';

export interface GetMobileHomeDataResponse {
  username: string;
  profileImageUrl: string;
  hardcorePoints: number;
  softcorePoints: number;
  trackedGamesCount: number;
  playlistCount: number;
  lastPlayedGame: MobileLastPlayedGame | null;
  recentDays: DayData[];
}

export interface MobileLastPlayedGame {
  gameId: number;
  title: string;
  gameIcon: string;
  consoleName: string;
  consoleType: number;
  achievementCount: string;
  points: string;
}
