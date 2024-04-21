import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'DELETE') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doDelete('/Auth/DeleteUserSession', req.cookies.rtSession)
  console.log(fetchResult)
  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(200).json(true)
  }
}
