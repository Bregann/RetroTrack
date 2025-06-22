export interface GetLoggedInSpecificGameInfoResponse {
    gameId: number
    title: string
    consoleId: number
    consoleName: string
    gameImage: string
    publisher: string
    developer: string
    imageInGame: string
    imageTitle: string
    imageBoxArt: string
    genre: string
    achievementCount: number
    players: number
    achievements: UserAchievement[]
    achievementsAwardedSoftcore: number
    achievementsAwardedHardcore: number
    achievementsAwardedTotal: number
    pointsAwardedSoftcore: number
    pointsAwardedHardcore: number
    pointsAwardedTotal: number
    totalGamePoints: number
}

export interface UserAchievement {
    id: number
    title: string
    description: string
    points: number
    badgeName: string
    dateEarnedSoftcore: null | string
    dateEarnedHardcore: null | string
    type: number | null
}
