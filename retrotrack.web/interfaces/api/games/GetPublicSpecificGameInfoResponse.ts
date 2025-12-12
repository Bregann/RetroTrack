import { AchievementType } from '@/enums/achievementType'

export interface GetPublicSpecificGameInfoResponse {
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
    achievements: Achievement[]
}

export interface Achievement {
    id: number
    title: string
    description: string
    points: number
    badgeName: string
    type: AchievementType | null
    achievementOrder: number
}
