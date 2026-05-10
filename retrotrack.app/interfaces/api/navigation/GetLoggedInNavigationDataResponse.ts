export interface GetLoggedInNavigationDataResponse {
  raName: string;
  raUserProfileUrl: string;
  gamesBeatenHardcore: number;
  gamesBeatenSoftcore: number;
  gamesCompleted: number;
  gamesMastered: number;
  userPoints: number;
  totalAchievementsSoftcore: number;
  totalAchievementsHardcore: number;
  trackedGamesCount: number;
  inProgressGamesCount: number;
  totalPointsSoftcore: number;
  totalPointsHardcore: number;
  consoleProgressData: ConsoleProgressData[];
}

export interface ConsoleProgressData {
  consoleId: number;
  consoleName: string;
  consoleType: number;
  gamesBeatenHardcore: number;
  gamesBeatenSoftcore: number;
  gamesCompleted: number;
  gamesMastered: number;
  totalGamesInConsole: number;
  percentageBeatenSoftcore: number;
  percentageBeatenHardcore: number;
  percentageCompleted: number;
  percentageMastered: number;
}
