export interface LibraryConsole {
  consoleId: number;
  consoleName: string;
  consoleType: number;
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

export interface LibraryPlaylist {
  playlistId: string;
  name: string;
  gameIds: number[];
}

export interface LibraryData {
  consoles: LibraryConsole[];
  trackedGames: LibraryTrackedGame[];
  playlists: LibraryPlaylist[];
  raUsername: string;
  profileImageUrl: string;
  hardcorePoints: number;
  achievementsEarnedHardcore: number;
}
