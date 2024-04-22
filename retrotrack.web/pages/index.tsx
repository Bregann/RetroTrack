import { type GetServerSideProps } from 'next'
import backendFetchHelper from '@/helpers/BackendFetchHelper'
import { Paper, Table } from '@mantine/core'
import Image from 'next/image'
import fetchHelper from '@/helpers/FetchHelper'
import notificationHelper from '@/helpers/NotificationHelper'
import { IconCrossFilled } from '@tabler/icons-react'
import { type GetSpecificGameInfo } from './api/games/GetSpecificGameInfo'
import { useState } from 'react'
import LoggedOutModal from '@/components/games/LoggedOutModal'
import { type GetGameInfoForUser } from './api/games/GetGameInfoForUser'
import LoggedInModal from '@/components/games/LoggedInModal'

interface IndexProps {
  loggedIn: boolean
  username: string
  recentGames: RecentGameUpdatesDayList[] | null
}

interface RecentGameUpdatesDayList {
  gamesTable: GamesTable[]
  date: string
}

interface GamesTable {
  gameId: number
  gameIconUrl: string
  gameName: string
  achievementCount: number
  gameGenre: string
  console: string
}

const Page = (props: IndexProps): JSX.Element => {
  const [loggedOutGameModalData, setLoggedOutGameModalData] = useState<GetSpecificGameInfo | undefined>(undefined)
  const [loggedInGameModalData, setLoggedInGameModalData] = useState<GetGameInfoForUser | undefined>(undefined)

  const GetLoggedOutGameInfo = async (gameId: number): Promise<void> => {
    const res = await fetchHelper.doGet('/games/GetSpecificGameInfo?gameId=' + gameId)

    if (res.errored) {
      notificationHelper.showErrorNotification('Error', 'There has been an error trying to get the game data. Please try again', 5000, <IconCrossFilled />)
    } else {
      setLoggedOutGameModalData(res.data)
    }
  }

  const GetLoggedInGameInfo = async (gameId: number): Promise<void> => {
    const res = await fetchHelper.doGet('/games/GetGameInfoForUser?gameId=' + gameId)

    if (res.errored) {
      notificationHelper.showErrorNotification('Error', 'There has been an error trying to get the game data. Please try again', 5000, <IconCrossFilled />)
    } else {
      setLoggedInGameModalData(res.data)
    }
  }

  return (
    <>
      <h1>{props.loggedIn ? `Welcome back, ${props.username}!` : 'Home'}</h1>

      {props.recentGames?.map((games) => {
        return (
            <div key={games.date}>
                <Paper shadow="md" p="md" withBorder mt={15}>
                    <h2>{games.date}</h2>
                    <Table
                      striped
                      highlightOnHover
                      highlightOnHoverColor='#4DABF775'
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Icon</Table.Th>
                          <Table.Th>Game Name</Table.Th>
                          <Table.Th>Achievement Count</Table.Th>
                          <Table.Th>Game Genre</Table.Th>
                          <Table.Th>Console</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {games.gamesTable?.sort((a, b) => a.gameName.localeCompare(b.gameName)).map((gameTableData) => {
                          return (
                            <Table.Tr key={gameTableData.gameId} onClick={async () => { props.loggedIn ? await GetLoggedInGameInfo(gameTableData.gameId) : await GetLoggedOutGameInfo(gameTableData.gameId) } }>
                              <Table.Td>
                                <Image
                                width={64}
                                height={64}
                                src={gameTableData.gameIconUrl}
                                alt=""
                              />
                              </Table.Td>
                              <Table.Td>{gameTableData.gameName}</Table.Td>
                              <Table.Td>{gameTableData.achievementCount}</Table.Td>
                              <Table.Td>{gameTableData.gameGenre}</Table.Td>
                              <Table.Td>{gameTableData.console}</Table.Td>
                            </Table.Tr>
                          )
                        })}
                      </Table.Tbody>
                    </Table>
                </Paper>
            </div>
        )
      })
      }

      <LoggedOutModal gameInfo={loggedOutGameModalData} onClose={() => { setLoggedOutGameModalData(undefined) }} />
      <LoggedInModal gameInfo={loggedInGameModalData} onCloseModal={() => { setLoggedInGameModalData(undefined) }} />
    </>
  )
}

export const getServerSideProps: GetServerSideProps<IndexProps> = async (context) => {
  const loggedIn = context.req.cookies.rtSession !== undefined
  const username = loggedIn ? (context.req.cookies.rtUsername ?? '') : ''

  const fetchResult = await backendFetchHelper.doGet('/Games/GetRecentlyAddedAndUpdatedGames')

  const pageProps: IndexProps = {
    loggedIn,
    username,
    recentGames: fetchResult.errored ? null : fetchResult.data
  }

  return {
    props: pageProps
  }
}

export default Page
