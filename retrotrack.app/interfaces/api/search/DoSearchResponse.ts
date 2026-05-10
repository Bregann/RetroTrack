export interface DoSearchResponse {
  totalGameResults: number;
  totalAchievementResults: number;
  gameResults: GameSearchResult[];
  achievementResults: AchievementSearchResult[];
}

export interface GameSearchResult {
  gameId: number;
  title: string;
  console: string;
  gameIconUrl: string;
  totalAchievements: number;
  totalPoints: number;
  genre: string;
}

export interface AchievementSearchResult {
  achievementId: number;
  title: string;
  description: string;
  iconUrl: string;
  points: number;
  gameId: number;
  gameTitle: string;
  console: string;
}

export interface GetSearchConsolesResponse {
  consoles: SearchConsoleItem[];
}

export interface SearchConsoleItem {
  id: number;
  name: string;
}
