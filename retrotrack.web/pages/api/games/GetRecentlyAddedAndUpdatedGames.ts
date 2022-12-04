import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendGet } from "../../../Helpers/backendFetchHelper";
import { RecentGameUpdatesDayList } from "../../../types/Api/Games/GetRecentlyAddedAndUpdatedGames";

const handler = async (req: NextApiRequest, res: NextApiResponse<RecentGameUpdatesDayList[]>) => {
    try {
        const apiRes = await DoBackendGet('/api/Navigation/GetLoggedOutUserGameCounts');
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