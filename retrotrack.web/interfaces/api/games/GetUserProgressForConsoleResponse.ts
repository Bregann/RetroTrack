import { HighestAwardKind } from '@/enums/highestAwardKind'

export interface GetUserProgressForConsoleResponse {
  totalCount: number
  totalPages: number
  games: LoggedInGame[]
  consoleName: string
  totalPointsToEarn: number
  totalAchievementsToEarn: number
  totalAchievementsEarnedSoftcore: number
  totalAchievementsEarnedHardcore: number
  totalGamesBeatenSoftcore: number
  totalGamesBeatenHardcore: number
  totalGamesCompletedSoftcore: number
  totalGamesMasteredHardcore: number
}

export interface LoggedInGame {
  gameId: number
  gameTitle: string
  gameGenre: string
  achievementCount: number
  achievementsUnlocked: number
  percentageComplete: number
  playerCount: number
  gameImageUrl: string
  points: number
  consoleName: string | null // Optional, can be null if consoleId is -1
  highestAward: HighestAwardKind
}
