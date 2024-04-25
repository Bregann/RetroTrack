import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface GetPublicNavigationDataDto {
  consoleId: number
  consoleName: string
  gameCount: number
  consoleType: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetPublicNavigationDataDto>): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doGet('/Navigation/GetPublicNavigationData')

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(fetchResult.data)
  }
}
