import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetSpecificGameInfo {
  gameId: number
  title: string
  consoleId: number
  consoleName: string
  imageInGame: string
  imageTitle: string
  imageBoxArt: string
  genre: string
  achievementCount: number
  players: number
  achievements: Achievement[]
  type: number
}

export interface Achievement {
  id: number
  type: number
  numAwarded: number
  numAwardedHardcore: number
  title: string
  description: string
  points: number
  badgeName: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetSpecificGameInfo>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405)
  }
  const { gameId } = req.query
  console.log(gameId)
  const fetchResult = await backendFetchHelper.doGet('/Games/GetSpecificGameInfo/'.concat(gameId?.toString() ?? ''))

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(fetchResult.data)
  }
}
