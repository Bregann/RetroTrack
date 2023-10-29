import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../../Helpers/backendFetchHelper";
import { GamesAndUserProgressForConsole } from "../../../../types/Api/Games/GetGamesAndUserProgressForConsole";

const handler = async (req: NextApiRequest, res: NextApiResponse<GamesAndUserProgressForConsole>) => {
    const { consoleid } = req.query;

    try {
        const apiRes = await DoBackendGet('/api/Games/GetGamesAndUserProgressForConsole?consoleId=' + consoleid, req.headers.authorization);

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