import type { NextApiRequest, NextApiResponse } from 'next'
import { handleClientScriptLoad } from 'next/script'
import { DoBackendPost } from '../../../Helpers/backendFetchHelper'
import { RegiserUserData } from '../../../types/Api/Auth/RegisterUser'

 const handler = async (req: NextApiRequest, res: NextApiResponse<RegiserUserData>) => {
    try {
        const apiRes = await DoBackendPost('/api/Auth/RegisterNewUser', req.body);

        if(!apiRes.ok){
            res.status(apiRes.status).json({success: false, reason: apiRes.statusText})
            return;
        }

        const apiData: RegiserUserData = await apiRes.json();
        
        res.status(200).json(apiData);

    } catch (error) {
        res.status(500).json({success: false, reason: "An error has occurred, please try again shortly."})
    }
  }

  export default handler;