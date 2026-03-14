export interface LibraryConsole {
  consoleId: number;
  consoleName: string;
  consoleType: string;
}

export interface LibraryTrackedGame {
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  imageIcon: string;
  imageBoxArt: string;
  achievementCount: number;
  points: number;
  achievementsEarned: number;
  percentageComplete: number;
  highestAward: string | null;
}

export interface LibraryData {
  consoles: LibraryConsole[];
  trackedGames: LibraryTrackedGame[];
}
