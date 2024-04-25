import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse<boolean>): Promise<void> {
  if (req.method !== 'DELETE') {
    res.status(405)
  }

  const { gameId } = req.query

  const fetchResult = await backendFetchHelper.doDelete('/TrackedGames/DeleteTrackedGame/'.concat(gameId?.toString() ?? ''), req.cookies.rtSession, req.cookies.rtUsername)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(fetchResult.statusCode).json(fetchResult.data)
  }
}
