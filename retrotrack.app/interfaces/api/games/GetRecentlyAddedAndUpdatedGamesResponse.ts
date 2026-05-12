export interface GetRecentlyAddedAndUpdatedGamesResponse {
  days: DayData[];
}

export interface DayData {
  date: string;
  newSets: GameData[];
  updatedSets: GameData[];
}

export interface GameData {
  gameId: number;
  title: string;
  gameIcon: string;
  consoleName: string;
  consoleType: number;
  achievementCount: string;
  points: string;
}
