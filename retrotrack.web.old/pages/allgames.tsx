import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { DoGet } from "../Helpers/webFetchHelper";
import { GamesForConsole } from "../types/Api/Games/GetGamesForConsole";
import { authOptions } from "./api/auth/[...nextauth]";
import { Text } from '@mantine/core';
import PublicGamesTable from "../components/Games/PublicGamesTable";
import { sortBy } from "lodash";
import { GamesAndUserProgressForConsole } from "../types/Api/Games/GetGamesAndUserProgressForConsole";
import LoggedInGamesTable from "../components/Games/LoggedInGamesTable";

type AllGamesProps = {
    publicConsoleData: GamesForConsole | null;
    loggedInConsoleData: GamesAndUserProgressForConsole | null;
    errorMessage: string | null;
}

const AllGames = (props: AllGamesProps) => {
    return ( 
        <>
        <Text size={40} align="center">All Games</Text>

        {props.publicConsoleData && <PublicGamesTable gameData={sortBy(props.publicConsoleData?.games, 'gameName')}/>}
        {props.loggedInConsoleData && <LoggedInGamesTable gameData={sortBy(props.loggedInConsoleData?.games, 'gameName')} sortByName="gameName" sortByDirection="asc"/>}
        {props.errorMessage && <Text size={30} align="center">{props.errorMessage}</Text>}

        </>
     );
}

export const getServerSideProps: GetServerSideProps<AllGamesProps> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    if(session?.sessionId){
        const res = await DoGet('/api/games/GetGamesAndUserProgressForConsole/' + 0, session.sessionId);
        if(res.ok){
            return{
                props: {
                    publicConsoleData: null,
                    loggedInConsoleData: await res.json(),
                    errorMessage: null
                }
            }
        }
        else{
            return{
                props: {
                    publicConsoleData: null,
                    loggedInConsoleData: null,
                    errorMessage: "Error getting console data - Error code " + res.status
                }
            }
        }
    }
    else{
        const res = await DoGet('/api/games/GetGamesForConsole/' + 0);

        if(res.ok){
            return{
                props: {
                    publicConsoleData: await res.json(),
                    loggedInConsoleData: null,
                    errorMessage: null
                }
            }
        }
        else{
            return{
                props: {
                    publicConsoleData: null,
                    loggedInConsoleData: null,
                    errorMessage: "Error getting console data - Error code " + res.status
                }
            }
        }
    }

}
 
export default AllGames;