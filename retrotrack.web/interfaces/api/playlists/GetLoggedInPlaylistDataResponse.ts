import { HighestAwardKind } from '@/enums/highestAwardKind'
import { PlaylistGameItem } from './GetPublicPlaylistDataResponse'

export interface GetLoggedInPlaylistDataResponse {
  id: string
  name: string
  description: string
  numberOfLikes: number
  numberOfGames: number
  numberOfConsoles: number
  createdAt: string
  updatedAt: string
  createdBy: string
  icons: string[]
  totalPointsToEarn: number
  totalAchievementsToEarn: number
  totalAchievementsEarnedSoftcore: number
  totalAchievementsEarnedHardcore: number
  totalGamesBeatenSoftcore: number
  totalGamesBeatenHardcore: number
  totalGamesCompletedSoftcore: number
  totalGamesMasteredHardcore: number
  games: LoggedInGameItem[]
}

export interface LoggedInGameItem extends PlaylistGameItem {
  highestAward?: HighestAwardKind
  achievementsEarnedSoftcore: number
  achievementsEarnedHardcore: number
}
