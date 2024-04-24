import { type GetServerSideProps } from 'next'
import sortBy from 'lodash/sortBy'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import PublicGamesTable, { type PublicGame } from '@/components/games/PublicGamesTable'
import LoggedInGamesTable, { type LoggedInGame } from '@/components/games/LoggedInGamesTable'

export interface GamesForConsole {
  consoleName: string
  consoleId: number
  games: PublicGame[]
}

export interface GamesAndUserProgressForConsole {
  consoleName: string
  consoleId: number
  games: LoggedInGame[]
}

interface ConsoleProps {
  publicConsoleData: GamesForConsole | null
  loggedInConsoleData: GamesAndUserProgressForConsole | null
}

const Console = (props: ConsoleProps): JSX.Element => {
  return (
    <>
      {(props.publicConsoleData === null && props.loggedInConsoleData === null) && <h1>There has been an error loading the games. Please refresh to try again</h1>}
      {props.publicConsoleData !== null
        ? <>
          <h1>{props.publicConsoleData.consoleName}</h1>
          <PublicGamesTable gameData={sortBy(props.publicConsoleData.games, 'gameName')} />
        </>
        : <>
          <h1>{props.loggedInConsoleData?.consoleName}</h1>
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
        loggedInConsoleData: res.errored ? null : await res.data
      }
    }
  } else {
    const res = await backendFetchHelper.doGet('/games/GetGamesForConsole/'.concat(consoleId?.toString() ?? ''))

    return {
      props: {
        publicConsoleData: res.errored ? null : await res.data,
        loggedInConsoleData: null
      }
    }
  }
}

export default Console
