import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../../Helpers/backendFetchHelper";
import { GetGameInfoForUser } from "../../../../types/Api/Games/GetGameInfoForUser";

const handler = async (req: NextApiRequest, res: NextApiResponse<GetGameInfoForUser>) => {
    const { gameid } = req.query;

    try {
        const apiRes = await DoBackendGet('/api/Games/GetGameInfoForUser?gameId=' + gameid, req.headers.authorization);
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