import { type GetServerSideProps } from 'next'
import { sortBy } from 'lodash'
import { type GamesAndUserProgressForConsole, type GamesForConsole } from './console/[consoleId]'
import PublicGamesTable from '@/components/games/PublicGamesTable'
import LoggedInGamesTable from '@/components/games/LoggedInGamesTable'
import backendFetchHelper from '@/helpers/BackendFetchHelper'

interface AllGamesProps {
  publicConsoleData: GamesForConsole | null
  loggedInConsoleData: GamesAndUserProgressForConsole | null
}

const AllGames = (props: AllGamesProps): JSX.Element => {
  return (
    <>
      <h1>All Games</h1>
      {(props.publicConsoleData === null && props.loggedInConsoleData === null) && <h1>There has been an error loading the games. Please refresh to try again</h1>}
      {props.publicConsoleData !== null
        ? <>
          <PublicGamesTable gameData={sortBy(props.publicConsoleData.games, 'gameName')} />
        </>
        : <>
          <LoggedInGamesTable gameData={sortBy(props.loggedInConsoleData?.games, 'gameName')} sortByName='gameName' sortByDirection='asc' />
        </>
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps<AllGamesProps> = async (context) => {
  // Check if logged in or logged out
  const loggedIn = context.req.cookies.rtSession !== undefined

  if (loggedIn) {
    const res = await backendFetchHelper.doGet('/games/GetGamesAndUserProgressForConsole/0', context.req.cookies.rtSession, context.req.cookies.rtUsername)

    return {
      props: {
        publicConsoleData: null,
        loggedInConsoleData: res.errored ? null : await res.data
      }
    }
  } else {
    const res = await backendFetchHelper.doGet('/games/GetGamesForConsole/0')

    return {
      props: {
        publicConsoleData: res.errored ? null : await res.data,
        loggedInConsoleData: null
      }
    }
  }
}

export default AllGames
