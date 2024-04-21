import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface Achievement {
  id: number
  title: string
  description: string
  points: number
  badgeName: string
  numAwarded: number
  numAwardedHardcore: number
  dateEarned: string
  type: number
}

export interface GetGameInfoForUser {
  gameId: number
  title: string
  consoleId: number
  imageInGame: string
  imageBoxArt: string
  genre: string
  consoleName: string
  achievementCount: number
  players: number
  achievements: Achievement[]
  numAwardedToUser: number
  userCompletion: string
  gameTracked: boolean
  totalPoints: number
  pointsEarned: number
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doGet('')

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(fetchResult.data)
  }
}
