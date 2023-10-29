import { NextApiRequest, NextApiResponse } from "next";
import { DoBackendPost } from "../../../Helpers/backendFetchHelper";

const handler = async (req: NextApiRequest, res: NextApiResponse<string>) => {
    try {
        const apiRes = await DoBackendPost('/api/Auth/DeleteUserSession', req.body);

        if(!apiRes.ok){
            res.status(apiRes.status).json("error");
            return;
        }

        res.status(apiRes.status).json("sucess");

    } catch (error) {
        res.status(500).json("error");
    }
  }

  export default handler;