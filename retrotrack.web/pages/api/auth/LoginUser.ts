import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface AttemptLoginDto {
  success: boolean
  sessionId: string
  username: string
  reason: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<AttemptLoginDto>): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doPost('/Auth/LoginUser', req.body)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(fetchResult.statusCode).json(fetchResult.data)
  }
}
