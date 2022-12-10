import { GetServerSideProps } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router'
import PublicGamesTable from '../../components/App/Games/PublicGamesTable';
import { DoGet } from '../../Helpers/webFetchHelper';
import { GamesForConsole } from '../../types/Api/Games/GetGamesForConsole'
import { authOptions } from '../api/auth/[...nextauth]';
import sortBy from 'lodash/sortBy';

type ConsoleProps = {
    publicConsoleData: GamesForConsole | null;

    error: string | null;
}

const Console = (props: ConsoleProps) => {
    console.log(props.publicConsoleData?.games.length);
    
    return ( 
        <>
        <h1>console: {props.publicConsoleData?.consoleName}</h1>

        {props.publicConsoleData && <PublicGamesTable gameData={sortBy(props.publicConsoleData?.games, 'gameName')}/>}
        </>

     );
}
 
export const getServerSideProps: GetServerSideProps<ConsoleProps> = async (context) => {
    //Check if logged in or logged out
    const session = await unstable_getServerSession(context.req, context.res, authOptions);
    const { consoleId } = context.query
    
    if(session?.sessionId){
        return{
            props:{
                publicConsoleData: null,
                error: null
            }
        }
    }
    else{
        const res = await DoGet('/api/games/GetGamesForConsole/' + consoleId);

        if(res.ok){
            return{
                props:{
                    publicConsoleData: await res.json(),
                    error: null
                }
            }
        }
        else{
            return{
                props:{
                    publicConsoleData: await res.json(),
                    error: "Error getting console data - Error code " + res.status
                }
            }
        }
    }
}


export default Console;