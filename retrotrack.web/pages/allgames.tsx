import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { DoGet } from "../Helpers/webFetchHelper";
import { GamesForConsole } from "../types/Api/Games/GetGamesForConsole";
import { authOptions } from "./api/auth/[...nextauth]";
import { Text } from '@mantine/core';
import PublicGamesTable from "../components/App/Games/PublicGamesTable";
import { sortBy } from "lodash";

type AllGamesProps = {
    publicConsoleData: GamesForConsole | null;

    error: string | null;
}

const AllGames = (props: AllGamesProps) => {
    return ( 
        <>
        <Text size={40} align="center">All Games</Text>

        {props.publicConsoleData && <PublicGamesTable gameData={sortBy(props.publicConsoleData?.games, 'gameName')}/>}
        </>
     );
}

export const getServerSideProps: GetServerSideProps<AllGamesProps> = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    if(session?.sessionId){
        return{
            props:{
                publicConsoleData: null,
                error: null
            }
        }
    }
    else{
        const res = await DoGet('/api/games/GetGamesForConsole/' + 0);

        if(res.ok){
            return{
                props: {
                    publicConsoleData: await res.json(),
                    error: null
                }
            }
        }
        else{
            return{
                props: {
                    publicConsoleData: await res.json(),
                    error: "Error getting console data - Error code " + res.status
                }
            }
        }
    }

}
 
export default AllGames;