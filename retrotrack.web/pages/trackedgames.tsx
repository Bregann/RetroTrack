import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { DoGet } from "../Helpers/webFetchHelper";
import { Game } from "../types/Api/Games/LoggedInGame";
import { authOptions } from "./api/auth/[...nextauth]";
import { Text } from "@mantine/core";

type TrackedGameProps = {
    games: Game[] | null;
    errorMessage: string | null;
}

const TrackedGames = (props: TrackedGameProps) => {
    return (
        <>
        {props.errorMessage && <Text size={30} align="center">{props.errorMessage}</Text>}
        </>
     );
}

export const getServerSideProps: GetServerSideProps<TrackedGameProps> = async (context) => {
    const session = await unstable_getServerSession(context.req, context.res, authOptions);

    if(!session){
        return{
            props: {
                games: null,
                errorMessage: 'You shall not pass! Please login to see this page'
            }
        }
    }

    const res = await DoGet('/api/trackedgames/GetTrackedGamesForUser', session.sessionId);
    if(res.ok){
      return {
        props: {
            games: await res.json(),
            errorMessage: null
        }
      }  
    }

    return {
        props: {
            games: null,
            errorMessage: 'Error getting tracked game data ' + res.status
        }
      }  
}

export default TrackedGames;