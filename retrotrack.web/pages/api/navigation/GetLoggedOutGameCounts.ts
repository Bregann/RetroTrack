import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { LoggedOutGameTypes } from "../../../types/Api/Navigation/NavGameCounts";

const handler = async (req: NextApiRequest, res: NextApiResponse<LoggedOutGameTypes>) => {
    try {
        const apiRes = await DoBackendGet('/api/Navigation/GetLoggedOutUserGameCounts');
        if(!apiRes.ok){
            res.status(apiRes.status).end();
            return;
        }

        const apiData = await apiRes.json();
        res.status(200).json(apiData);
        
    } catch (error) {
        res.status(500).end();
    }
}

export default handler;