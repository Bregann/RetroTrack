export interface GetGamesForConsoleResponse {
    totalCount: number
    totalPages: number
    games: Game[]
}

export interface Game {
    gameId: number
    gameTitle: string
    gameGenre: string
    achievementCount: number
    playerCount: number
    gameImageUrl: string
}
