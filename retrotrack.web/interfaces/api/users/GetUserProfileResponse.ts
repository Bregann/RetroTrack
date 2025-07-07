import { HighestAwardKind } from '@/enums/highestAwardKind'

export interface GetUserProfileResponse {
  raUsername: string
  lastUserUpdate: Date
  softcorePoints: number
  hardcorePoints: number
  gamesBeatenSoftcore: number
  gamesBeatenHardcore: number
  gamesCompleted: number
  gamesMastered: number
  achievementsEarnedSoftcore: number
  achievementsEarnedHardcore: number
  gamesInProgress: number
  gamesBeatenWall: GamesWall[]
  gamesMasteredWall: GamesWall[]
  last5GamesPlayed: Last5[]
  last5Awards: Last5[]
  consoleProgressData: ConsoleProgressDatum[]
  message?: string
}

export interface ConsoleProgressDatum {
  consoleId: number
  consoleName: string
  consoleType: number
  gamesBeatenHardcore: number
  gamesBeatenSoftcore: number
  gamesCompleted: number
  gamesMastered: number
  totalGamesInConsole: number
  percentageBeatenSoftcore: number
  percentageBeatenHardcore: number
  percentageCompleted: number
  percentageMastered: number
}

export interface GamesWall {
  gameId: number
  title: string
  consoleName: string
  imageUrl: string
  dateAchieved: Date
  isHardcore: boolean
  wallPosition: number
  progressId: number
}

export interface Last5 {
  gameId: number
  title: string
  imageUrl: string
  datePlayed: Date
  totalGameAchievements: number
  totalGamePoints: number
  achievementsUnlockedSoftcore: number
  achievementsUnlockedHardcore: number
  highestAward: HighestAwardKind | null
}
