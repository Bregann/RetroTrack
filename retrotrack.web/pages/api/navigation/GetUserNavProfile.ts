import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { UserNavProfile } from "../../../types/Api/Navigation/UserNavProfile";

const handler = async (req: NextApiRequest, res: NextApiResponse<UserNavProfile>) => {
    try {
        const apiRes = await DoBackendGet('/api/Navigation/GetUserNavProfile', req.headers.authorization);

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