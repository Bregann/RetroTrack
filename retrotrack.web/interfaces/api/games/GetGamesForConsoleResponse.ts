export interface GetGamesForConsoleResponse {
    totalCount: number
    totalPages: number
    games: Game[]
    consoleName: string
    totalPoints: number
    totalAchievements: number
    totalPlayers: number
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
    buttons?: string
    medianTimeToBeatHardcoreSeconds: number | null
    medianTimeToBeatHardcoreFormatted: string | null
    medianTimeToMasterSeconds: number | null
    medianTimeToMasterFormatted: string | null
}
