export interface GetGamesForConsoleResponse {
    totalCount: number
    totalPages: number
    games: Game[]
    consoleName: string
}

export interface Game {
    gameId: number
    gameTitle: string
    gameGenre: string
    achievementCount: number
    playerCount: number
    gameImageUrl: string
    points: number
    consoleName?: string // Optional, only present if consoleId is -1
}
