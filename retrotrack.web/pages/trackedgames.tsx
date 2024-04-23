import { type GetServerSideProps } from 'next'
import { useState } from 'react'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import LoggedInGamesTable, { type LoggedInGame } from '@/components/games/LoggedInGamesTable'
import fetchHelper from '@/helpers/FetchHelper'

interface TrackedGameProps {
  games: LoggedInGame[] | null
  errorMessage: string | null
  username: string | null
}

const TrackedGames = (props: TrackedGameProps): JSX.Element => {
  const [gameData, setGameData] = useState(props.games)

  const updateTrackedGames = async (): Promise<void> => {
    const res = await fetchHelper.doGet('/trackedgames/GetTrackedGamesForUser')

    if (!res.errored) {
      setGameData(res.data)
    }
  }

  return (
    <>
      {props.errorMessage !== null && <h1>{props.errorMessage}</h1>}
      {gameData !== null &&
        <>
          <h1>{props.username}&apos;s Tracked Games</h1>
          <LoggedInGamesTable gameData={gameData} updateTableData={async () => { await updateTrackedGames() }} sortByName="gameName" sortByDirection="asc" />
        </>}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<TrackedGameProps> = async (context) => {
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

  const res = await backendFetchHelper.doGet('/TrackedGames/GetTrackedGamesForUser', context.req.cookies.rtSession, context.req.cookies.rtUsername)

  return {
    props: {
      games: res.errored ? null : await res.data,
      errorMessage: res.errored ? 'Error getting tracked game data ' + res.statusCode : null,
      username: context.req.cookies.rtUsername ?? null
    }
  }
}

export default TrackedGames
