import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { Game } from "../../../types/Api/Games/LoggedInGame";

const handler = async (req: NextApiRequest, res: NextApiResponse<Game[]>) => {
    try {
        const apiRes = await DoBackendGet('/api/Games/GetUserInProgressGames', req.headers.authorization);
        const data = await apiRes.json();
        
        if(!apiRes.ok){
            res.status(apiRes.status).end();
            return;
        }
    
        res.status(200).json(data);
    
    } catch (error) {
        res.status(500).end();
    }
}
    
    export default handler;