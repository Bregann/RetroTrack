import backendFetchHelper from '@/helpers/BackendFetchHelper'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface ResetUserPasswordDto {
  success: boolean
  reason: string
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<ResetUserPasswordDto>): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405)
  }

  const fetchResult = await backendFetchHelper.doPost('/Auth/ResetUserPassword', req.body)

  if (fetchResult.errored) {
    res.status(500)
  } else {
    res.status(fetchResult.statusCode).json(fetchResult.data)
  }
}
