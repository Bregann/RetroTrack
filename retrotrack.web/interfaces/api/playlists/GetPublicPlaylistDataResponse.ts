export interface GetPublicPlaylistDataResponse {
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
  games: PlaylistGameItem[]
  totalPointsToEarn: number
  totalAchievementsToEarn: number
}

export interface PlaylistGameItem {
  orderIndex: number
  gameId: number
  players: number
  title: string
  consoleName: string
  gameIconUrl: string
  genre: string
  achievementCount: number
  points: number
}
