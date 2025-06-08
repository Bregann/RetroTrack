import { type GetServerSideProps } from 'next'
import { useState } from 'react'
import LoggedInGamesTable, { type LoggedInGame } from '@/components/games/LoggedInGamesTable'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import fetchHelper from '@/helpers/FetchHelper'

interface InProgressGamesProps {
  games: LoggedInGame[] | null
  errorMessage: string | null
  username: string | null
}

const InProgressGames = (props: InProgressGamesProps): JSX.Element => {
  const [gameData, setGameData] = useState(props.games)

  const updateInProgressGames = async (): Promise<void> => {
    const res = await fetchHelper.doGet('/games/GetUserInProgressGames')

    if (!res.errored) {
      setGameData(res.data)
    }
  }

  return (
    <>
      {props.errorMessage !== null && <h1>{props.errorMessage}</h1>}
      {gameData !== null &&
        <>
          <h1>{props.username}&apos;s In Progress Games</h1>
          <LoggedInGamesTable gameData={gameData} updateTableData={async () => { await updateInProgressGames() }} sortByName="gameName" sortByDirection="asc" />
        </>}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<InProgressGamesProps> = async (context) => {
  const loggedIn = context.req.cookies.rtSession !== undefined

  if (!loggedIn) {
    return {
      props: {
        games: null,
        errorMessage: 'You shall not pass! Please login to see this page',
        username: null
      }
    }
  }

  const res = await backendFetchHelper.doGet('/games/GetUserInProgressGames', context.req.cookies.rtSession, context.req.cookies.rtUsername)

  return {
    props: {
      games: res.errored ? null : await res.data,
      errorMessage: res.errored ? 'Error getting in progress game data ' + res.statusCode : null,
      username: context.req.cookies.rtUsername ?? null
    }
  }
}

export default InProgressGames
