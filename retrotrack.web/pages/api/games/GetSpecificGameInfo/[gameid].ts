import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../../Helpers/backendFetchHelper";
import { GetSpecificGameInfo } from "../../../../types/Api/Games/GetSpecificGameInfo";

const handler = async (req: NextApiRequest, res: NextApiResponse<GetSpecificGameInfo>) => {
    const { gameid } = req.query;

    try {
        const apiRes = await DoBackendGet('/api/Games/GetSpecificGameInfo?gameId=' + gameid);
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