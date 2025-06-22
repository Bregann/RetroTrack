import { HighestAwardKind } from '@/enums/highestAwardKind'

export interface GetUserProgressForConsoleResponse {
    totalCount: number
    totalPages: number
    games: LoggedInGame[]
    consoleName: string
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
