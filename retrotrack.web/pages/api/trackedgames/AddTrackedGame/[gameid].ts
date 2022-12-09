import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet, DoBackendPost } from "../../../../Helpers/backendFetchHelper";

const handler = async (req: NextApiRequest, res: NextApiResponse<boolean>) => {
    const { gameid } = req.query;

    try {
        const apiRes = await DoBackendPost('/api/TrackedGames/AddTrackedGame?gameId=' + gameid, null, req.headers.authorization);
        const data = await apiRes.json();
        
        if(!apiRes.ok){
            res.status(apiRes.status).json(data);
            return;
        }
    
        res.status(200).json(data);
    
    } catch (error) {
        res.status(500).json(false)
    }
}
    
export default handler;