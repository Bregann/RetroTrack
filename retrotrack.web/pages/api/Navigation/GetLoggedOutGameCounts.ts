import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { LoggedOutGameTypes } from "../../../types/Api/Navigation/LoggedOutGameCounts";

const handler = async (req: NextApiRequest, res: NextApiResponse<LoggedOutGameTypes>) => {
    try {
        const apiRes = await DoBackendGet('/api/Navigation/GetLoggedOutUserGameCounts');

        if(!apiRes.ok){
            res.status(apiRes.status);
            return;
        }

        const apiData = await apiRes.json();
        res.status(200).json(apiData);
        
    } catch (error) {
        
    }
}

export default handler;