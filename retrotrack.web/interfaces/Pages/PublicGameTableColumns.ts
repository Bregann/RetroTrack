export interface PublicGameTableColumns {
    gameImageUrl: string
    gameTitle: string
    gameGenre: string
    achievementCount: number
    playerCount: number
    points: number
    consoleName?: string // Optional, only present if consoleId is -1
}
