import { type GetServerSideProps } from 'next'
import sortBy from 'lodash/sortBy'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import PublicGamesTable, { type PublicGame } from '@/components/games/PublicGamesTable'

interface GamesForConsole {
  consoleName: string
  consoleId: number
  games: PublicGame[]
}

interface ConsoleProps {
  publicConsoleData: GamesForConsole | null
  errorMessage: string | null
}

const Console = (props: ConsoleProps): JSX.Element => {
  return (
        <>
        <PublicGamesTable gameData={sortBy(props.publicConsoleData?.games, 'gameName')}/>
        </>
  )
}

export const getServerSideProps: GetServerSideProps<ConsoleProps> = async (context) => {
  // Check if logged in or logged out
  const { consoleId } = context.query

  const res = await backendFetchHelper.doGet('/games/GetGamesForConsole/'.concat(consoleId?.toString() ?? ''))

  if (!res.errored) {
    return {
      props: {
        publicConsoleData: await res.data,
        loggedInConsoleData: null,
        errorMessage: null
      }
    }
  } else {
    return {
      props: {
        publicConsoleData: null,
        loggedInConsoleData: null,
        errorMessage: 'Error getting console data - Error code ' + res.statusCode
      }
    }
  }
}

export default Console
