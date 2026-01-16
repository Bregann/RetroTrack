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
    medianTimeToBeatHardcoreSeconds: number | null
    medianTimeToBeatHardcoreFormatted: string | null
    medianTimeToMasterSeconds: number | null
    medianTimeToMasterFormatted: string | null
    subsets: PublicSubsetGame[]
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

export interface PublicSubsetGame {
    gameId: number
    title: string
    gameImage: string
    achievementCount: number
    points: number
    achievements: PublicSubsetAchievement[]
}

export interface PublicSubsetAchievement {
    id: number
    title: string
    description: string
    points: number
    badgeName: string
    type: AchievementType | null
    achievementOrder: number
}
