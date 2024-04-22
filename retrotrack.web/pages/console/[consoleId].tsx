import { type GetServerSideProps } from 'next'
import sortBy from 'lodash/sortBy'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import PublicGamesTable, { type PublicGame } from '@/components/games/PublicGamesTable'
import LoggedInGamesTable, { type LoggedInGame } from '@/components/games/LoggedInGamesTable'

interface GamesForConsole {
  consoleName: string
  consoleId: number
  games: PublicGame[]
}

interface GamesAndUserProgressForConsole {
  consoleName: string
  consoleId: number
  games: LoggedInGame[]
}

interface ConsoleProps {
  publicConsoleData: GamesForConsole | null
  loggedInConsoleData: GamesAndUserProgressForConsole | null
  errorMessage: string | null
}

const Console = (props: ConsoleProps): JSX.Element => {
  console.log(props.loggedInConsoleData)
  return (
    <>
      {props.publicConsoleData !== null
        ? <>
          <h2>{props.publicConsoleData.consoleName}</h2>
          <PublicGamesTable gameData={sortBy(props.publicConsoleData.games, 'gameName')} />
        </>
        : <>
          <h2>{props.loggedInConsoleData?.consoleName}</h2>
          <LoggedInGamesTable gameData={sortBy(props.loggedInConsoleData?.games, 'gameName')} sortByName='gameName' sortByDirection='asc' />
        </>
      }
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ConsoleProps> = async (context) => {
  // Check if logged in or logged out
  const loggedIn = context.req.cookies.rtSession !== undefined

  const { consoleId } = context.query

  if (loggedIn) {
    const res = await backendFetchHelper.doGet('/games/GetGamesAndUserProgressForConsole/'.concat(consoleId?.toString() ?? ''), context.req.cookies.rtSession, context.req.cookies.rtUsername)

    return {
      props: {
        publicConsoleData: null,
        loggedInConsoleData: res.errored ? null : await res.data,
        errorMessage: res.errored ? 'Error getting console data - Error code ' + res.statusCode : null
      }
    }
  } else {
    const res = await backendFetchHelper.doGet('/games/GetGamesForConsole/'.concat(consoleId?.toString() ?? ''))

    return {
      props: {
        publicConsoleData: res.errored ? null : await res.data,
        loggedInConsoleData: null,
        errorMessage: res.errored ? 'Error getting console data - Error code ' + res.statusCode : null
      }
    }
  }
}

export default Console
