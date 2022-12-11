import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router'
import PublicGamesTable from '../../components/Games/PublicGamesTable';
import { DoGet } from '../../Helpers/webFetchHelper';
import { GamesForConsole } from '../../types/Api/Games/GetGamesForConsole'
import { authOptions } from '../api/auth/[...nextauth]';
import sortBy from 'lodash/sortBy';
import { Text } from '@mantine/core';
import { GamesAndUserProgressForConsole } from '../../types/Api/Games/GetGamesAndUserProgressForConsole';
import LoggedInGamesTable from '../../components/Games/LoggedInGamesTable';

type ConsoleProps = {
    publicConsoleData: GamesForConsole | null;
    loggedInConsoleData: GamesAndUserProgressForConsole | null;
    errorMessage: string | null;
}

const Console = (props: ConsoleProps) => {
    
    return ( 
        <>
        {props.errorMessage && <Text size={30} align="center">{props.errorMessage}</Text>}

        {props.publicConsoleData && 
        <>
        <Text size={40} align="center">{props.publicConsoleData?.consoleName}</Text>
        <PublicGamesTable gameData={sortBy(props.publicConsoleData?.games, 'gameName')}/>
        </>}

        {props.loggedInConsoleData &&
        <>
        <Text size={40} align="center">{props.loggedInConsoleData?.consoleName}</Text>
        <LoggedInGamesTable gameData={sortBy(props.loggedInConsoleData?.games, 'gameName')}/>
        </>
        }

        </>
     );
}
 
export const getServerSideProps: GetServerSideProps<ConsoleProps> = async (context) => {
    //Check if logged in or logged out
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const { consoleId } = context.query
    
    if(session?.sessionId){
        const res = await DoGet('/api/games/GetGamesAndUserProgressForConsole/' + consoleId, session.sessionId);

        if(res.ok){
            return{
                props:{
                    publicConsoleData: null,
                    loggedInConsoleData: await res.json(),
                    errorMessage: null
                }
            }
        }
        else{
            return{
                props:{
                    publicConsoleData: null,
                    loggedInConsoleData: null,
                    errorMessage: "Error getting console data - Error code " + res.status
                }
            }
        }
    }
    else{
        const res = await DoGet('/api/games/GetGamesForConsole/' + consoleId);

        if(res.ok){
            return{
                props:{
                    publicConsoleData: await res.json(),
                    loggedInConsoleData: null,
                    errorMessage: null
                }
            }
        }
        else{
            return{
                props:{
                    publicConsoleData: null,
                    loggedInConsoleData: null,
                    errorMessage: "Error getting console data - Error code " + res.status
                }
            }
        }
    }
}


export default Console;