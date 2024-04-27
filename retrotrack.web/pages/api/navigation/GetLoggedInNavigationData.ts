import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetLoggedInNavigationDataDto {
  raName: string
  raUserProfileUrl: string
  gamesBeaten: number
  gamesMastered: number
  userPoints: number
  userRank: number
  trackedGamesCount: number
  inProgressGamesCount: number
  consoleProgressData: ConsoleProgressData[]
}

interface ConsoleProgressData {
  consoleId: number
  consoleName: string
  consoleType: number
  gamesMastered: number
  gamesBeaten: number
  totalGamesInConsole: number
  percentageBeaten: number
  percentageMastered: number
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<GetLoggedInNavigationDataDto>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doGet('/Navigation/GetLoggedInNavigationData', req.cookies.rtSession, req.cookies.rtUsername)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(fetchResult.statusCode).json(fetchResult.data)
  }
}
