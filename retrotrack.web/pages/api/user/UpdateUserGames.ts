import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface UpdateUserGamesDto {
  success: boolean
  reason: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<UpdateUserGamesDto>): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doPost('/Users/UpdateUserGames', req.body, req.cookies.rtSession, req.cookies.rtUsername)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(fetchResult.data)
  }
}
