import { type LoggedInGame } from '@/components/games/LoggedInGamesTable'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse<LoggedInGame[]>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doGet('/trackedgames/GetTrackedGamesForUser', req.cookies.rtSession, req.cookies.rtUsername)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(fetchResult.data)
  }
}
