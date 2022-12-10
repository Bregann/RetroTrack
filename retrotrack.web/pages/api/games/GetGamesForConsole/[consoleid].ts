import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../../Helpers/backendFetchHelper";
import { GamesForConsole } from "../../../../types/Api/Games/GetGamesForConsole";

const handler = async (req: NextApiRequest, res: NextApiResponse<GamesForConsole>) => {
    const { consoleid } = req.query;

    try {
        const apiRes = await DoBackendGet('/api/Games/GetGamesForConsole?consoleId=' + consoleid);

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