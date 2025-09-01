export interface SearchGamesResponse {
  results: PlaylistSearchGameResult[]
}

export interface PlaylistSearchGameResult {
  gameId: number
  title: string
  consoleName: string
  gameImage: string
  achievementCount: number
  points: number
}
