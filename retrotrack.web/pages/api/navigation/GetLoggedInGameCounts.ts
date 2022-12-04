import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { LoggedInGameTypes } from "../../../types/Api/Navigation/NavGameCounts";

const handler = async (req: NextApiRequest, res: NextApiResponse<LoggedInGameTypes>) => {
    try {
        const apiRes = await DoBackendGet('/api/Navigation/GetLoggedInUserGameCounts', req.headers.authorization);
        if(!apiRes.ok){
            res.status(apiRes.status);
            return;
        }

        const apiData = await apiRes.json();
        res.status(200).json(apiData);
        
    } catch (error) {
        res.status(500);
    }
}

export default handler;