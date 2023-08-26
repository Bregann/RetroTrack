import { type GetServerSideProps } from 'next'
import { getServerSession } from 'next-auth'
import { DoGet } from '../Helpers/webFetchHelper'
import { type Game } from '../types/Api/Games/LoggedInGame'
import { authOptions } from './api/auth/[...nextauth]'
import { Text } from '@mantine/core'
import LoggedInGamesTable from '../components/Games/LoggedInGamesTable'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface InProgressGamesProps {
  games: Game[] | null
  errorMessage: string | null
}

const InProgressGames = (props: InProgressGamesProps): JSX.Element => {
  const [tableUpdatedNeeded, setTableDataUpdateNeeded] = useState(false)
  const [gameData, setGameData] = useState(props.games)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (tableUpdatedNeeded) {
        const res = await DoGet('/api/games/GetUserInProgressGames', session?.sessionId)

        if (res.ok) {
          const data = await res.json()
          setGameData(data)
        }
      }
    }

    void fetchData()
    setTableDataUpdateNeeded(false)
  }, [session, tableUpdatedNeeded])

  return (
        <>
        {(props.errorMessage !== null) && <Text size={30} align="center">{props.errorMessage}</Text>}
        {(gameData != null) &&
        <>
            <Text size={40} align="center">{session?.username}&apos;s In Progress Games</Text>
            <LoggedInGamesTable gameData={gameData} setTableDataUpdateNeeded={setTableDataUpdateNeeded} sortByName="percentageCompleted" sortByDirection="desc"/>
        </>}
        </>
  )
}

export const getServerSideProps: GetServerSideProps<InProgressGamesProps> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session == null) {
    return {
      props: {
        games: null,
        errorMessage: 'You shall not pass! Please login to see this page'
      }
    }
  }

  const res = await DoGet('/api/games/GetUserInProgressGames', session.sessionId)
  if (res.ok) {
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
      errorMessage: `Error getting in progress game data ${res.status}`
    }
  }
}

export default InProgressGames
