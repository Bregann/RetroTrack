import type { NextApiRequest, NextApiResponse } from 'next'
import { DoBackendGet } from '../../../Helpers/backendFetchHelper'

 const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
    
    try {
        const apiRes = await DoBackendGet('/api/Users/CheckUserUpdateProcessingState', req.headers.authorization);
        const data = await apiRes.json();
        
        if(!apiRes.ok){
            res.status(apiRes.status).json(false);
            return;
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json(false);
    }
  }

  export default handler;