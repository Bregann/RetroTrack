import type { NextApiRequest, NextApiResponse } from 'next'
import { handleClientScriptLoad } from 'next/script'
import { DoBackendGet, DoBackendPost } from '../../../Helpers/backendFetchHelper'
import { UpdateUserGames } from '../../../types/Api/User/UpdateUserGames'

const handler = async (req: NextApiRequest, res: NextApiResponse<UpdateUserGames>) => {

try {
    const apiRes = await DoBackendGet('/api/Users/UpdateUserGames', req.headers.authorization);
    const data = await apiRes.json();
    
    if(!apiRes.ok){
        res.status(apiRes.status).json(data);
        return;
    }

    res.status(200).json(data);

} catch (error) {
    res.status(500).json({success: false, reason: "An error has occurred, please try again shortly."});
}
}

export default handler;