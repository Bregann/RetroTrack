import { UserPlaylist } from '../playlists/UserPlaylist'

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
    gameTracked: boolean
    achievements: UserAchievement[]
    achievementsAwardedSoftcore: number
    achievementsAwardedHardcore: number
    achievementsAwardedTotal: number
    pointsAwardedSoftcore: number
    pointsAwardedHardcore: number
    pointsAwardedTotal: number
    totalGamePoints: number
    dateBeatenSoftcore: string | null
    dateBeatenHardcore: string | null
    dateCompleted: string | null
    dateMastered: string | null
    userNotes: string | null
    playlists: UserPlaylist[]
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
    achievementOrder: number
}
