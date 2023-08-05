export interface LoggedOutGameTypes {
  games: Record<string, number>
}

export interface LoggedInGameTypes {
  games: Record<string, Game>
  gamesTracked: number
  inProgressGames: number
}

export interface Game {
  gamesTotalAndCompleted: string
  percentage: number
}

export interface NavData {
  loggedOut?: LoggedOutGameTypes
  loggedIn?: LoggedInGameTypes
}
