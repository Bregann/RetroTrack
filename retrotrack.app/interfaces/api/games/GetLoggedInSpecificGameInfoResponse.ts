export interface GetLoggedInSpecificGameInfoResponse {
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  gameImage: string;
  publisher: string;
  developer: string;
  imageInGame: string;
  imageTitle: string;
  imageBoxArt: string;
  genre: string;
  achievementCount: number;
  players: number;
  gameTracked: boolean;
  achievements: UserAchievement[];
  achievementsAwardedSoftcore: number;
  achievementsAwardedHardcore: number;
  achievementsAwardedTotal: number;
  pointsAwardedSoftcore: number;
  pointsAwardedHardcore: number;
  pointsAwardedTotal: number;
  totalGamePoints: number;
  dateBeatenSoftcore: string | null;
  dateBeatenHardcore: string | null;
  dateCompleted: string | null;
  dateMastered: string | null;
  userNotes: string | null;
  playlists: UserPlaylist[];
  medianTimeToBeatHardcoreSeconds: number | null;
  medianTimeToBeatHardcoreFormatted: string | null;
  medianTimeToMasterSeconds: number | null;
  medianTimeToMasterFormatted: string | null;
  subsets: SubsetGame[];
}

export interface UserAchievement {
  id: number;
  title: string;
  description: string;
  points: number;
  badgeName: string;
  dateEarnedSoftcore: string | null;
  dateEarnedHardcore: string | null;
  type: number | null;
  achievementOrder: number;
}

export interface SubsetGame {
  gameId: number;
  title: string;
  gameImage: string;
  achievementCount: number;
  points: number;
  achievementsUnlocked: number;
  percentageComplete: number;
  achievements: UserAchievement[];
}

export interface UserPlaylist {
  playlistId: string;
  name: string;
}
