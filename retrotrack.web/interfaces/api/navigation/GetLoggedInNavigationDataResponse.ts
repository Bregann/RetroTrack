export interface GetLoggedInNavigationDataResponse {
    raName: string
    raUserProfileUrl: string
    gamesBeatenHardcore: number
    gamesBeatenSoftcore: number
    totalAchievementsSoftcore: number
    totalAchievementsHardcore: number
    gamesCompleted: number
    gamesMastered: number
    totalPointsSoftcore: number
    totalPointsHardcore: number
    trackedGamesCount: number
    inProgressGamesCount: number
    consoleProgressData: ConsoleProgressDatum[]
}

export interface ConsoleProgressDatum {
    consoleId: number
    consoleName: string
    consoleType: number
    gamesBeatenHardcore: number
    gamesBeatenSoftcore: number
    gamesCompleted: number
    gamesMastered: number
    totalGamesInConsole: number
    percentageBeatenSoftcore: number
    percentageBeatenHardcore: number
    percentageCompleted: number
    percentageMastered: number
}
