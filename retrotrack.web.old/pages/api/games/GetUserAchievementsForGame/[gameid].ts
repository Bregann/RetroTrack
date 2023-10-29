import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../../Helpers/backendFetchHelper";
import { GetSpecificGameInfo } from "../../../../types/Api/Games/GetSpecificGameInfo";
import { UserAchievementsForGame } from "../../../../types/Api/Games/GetUserAchievementsForGame";

const handler = async (req: NextApiRequest, res: NextApiResponse<UserAchievementsForGame>) => {
    const { gameid } = req.query;

    try {
        const apiRes = await DoBackendGet('/api/Games/GetUserAchievementsForGame?gameId=' + gameid, req.headers.authorization);
        if(!apiRes.ok){
            res.status(apiRes.status).end(); //debug this
            return;
        }

        const apiData = await apiRes.json();
        res.status(200).json(apiData);
        
    } catch (error) {
        res.status(500).end();
    }
}

export default handler;