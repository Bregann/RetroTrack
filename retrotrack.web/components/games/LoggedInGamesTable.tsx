import { Paper, Group, TextInput, UnstyledButton, LoadingOverlay, Text, Switch } from '@mantine/core'
import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import Image from 'next/image'
import { useDebouncedValue } from '@mantine/hooks'
import { sortBy } from 'lodash'
import { useState, useEffect } from 'react'
import LoggedInModal from './LoggedInModal'
import { IconCrossFilled, IconSearch, IconSquareX } from '@tabler/icons-react'
import { type GetGameInfoForUser } from '@/pages/api/games/GetGameInfoForUser'
import fetchHelper from '@/helpers/FetchHelper'
import notificationHelper from '@/helpers/NotificationHelper'

export interface LoggedInGame {
  gameId: number
  gameIconUrl: string
  gameName: string
  achievementCount: number
  achievementsGained: number
  percentageCompleted: number
  gameGenre: string
  players: number
  console: null
}

interface LoggedInGameTableProps {
  gameData: LoggedInGame[]
  sortByName: string
  sortByDirection: 'desc' | 'asc'
  updateTableData?: () => Promise<void> // used for updating the table in /trackedgames and /inprogressgames
}

const LoggedInGamesTable = (props: LoggedInGameTableProps): JSX.Element => {
  const [pageSize, setPageSize] = useState(15)
  const [page, setPage] = useState(1)
  const [games, setGames] = useState(sortBy(props.gameData.slice(0, pageSize), 'gameName'))
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: props.sortByName, direction: props.sortByDirection })
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 200)
  const [totalRecords, setTotalRecords] = useState(props.gameData.length)
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  const [completedSwitch, setCompletedSwitch] = useState(true)
  const [inProgressSwitch, setInProgressSwitch] = useState(false)
  const [loggedInGameModalData, setLoggedInGameModalData] = useState<GetGameInfoForUser | undefined>(undefined)

  useEffect(() => {
    const from = (page - 1) * pageSize
    const to = from + pageSize

    const data = sortBy(props.gameData, sortStatus.columnAccessor)
    const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data

    let filteredGames = sortedData.filter(({ gameName, achievementCount, gameGenre, players }) => {
      if (
        debouncedQuery !== '' &&
        !`${gameName} ${achievementCount} ${gameGenre} ${players}`
          .toLowerCase()
          .includes(debouncedQuery.trim().toLowerCase())
      ) {
        return false
      }

      return true
    })

    if (completedSwitch) {
      filteredGames = filteredGames.filter(({ percentageCompleted }) => {
        return percentageCompleted !== 100
      })
    }

    if (inProgressSwitch) {
      filteredGames = filteredGames.filter(({ percentageCompleted }) => {
        return percentageCompleted === 0 || percentageCompleted === 100
      })
    }

    setTotalRecords(filteredGames.length)
    setGames(filteredGames.slice(from, to))
  }, [page, props.gameData, sortStatus, pageSize, debouncedQuery, completedSwitch, inProgressSwitch])

  const GetGameInfoForModal = async (gameId: number): Promise<void> => {
    setLoadingOverlayVisible(true)
    const res = await fetchHelper.doGet('/games/GetGameInfoForUser?gameId=' + gameId)

    if (res.errored) {
      notificationHelper.showErrorNotification('Error', 'There has been an error trying to get the game data. Please try again', 5000, <IconCrossFilled />)
    } else {
      setLoggedInGameModalData(res.data)
    }

    setLoadingOverlayVisible(false)
  }

  return (
    <>
      <Paper shadow="md" p="md" withBorder mt={15}>
        <Group>
          <TextInput
            style={{ width: '80%', marginBottom: 20 }}
            placeholder="Search games..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => { setQuery(e.currentTarget.value) }}
          />

          <UnstyledButton style={{ marginBottom: 21, marginLeft: -45, zIndex: 1 }} onClick={() => { setQuery('') }}>
            <IconSquareX size={20} />
          </UnstyledButton>

          <Switch size="lg" offLabel="Show Completed" onLabel="Hide Completed" pb={35} pl={10} onChange={(event) => { setCompletedSwitch(event.currentTarget.checked) }} defaultChecked={true} />
          <Switch size="lg" offLabel="Show In Progress" onLabel="Hide In Progress" pb={35} onChange={(event) => { setInProgressSwitch(event.currentTarget.checked) }} />
        </Group>

        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loadingOverlayVisible} />
          <DataTable
            striped
            highlightOnHover
            records={games as any}
            columns={[
              {
                accessor: 'gameIconUrl',
                title: '',
                render: ({ gameIconUrl }) => (
                  <Image
                    width={64}
                    height={64}
                    src={gameIconUrl as string}
                    alt={'game icon'}
                  />
                )
              },
              {
                accessor: 'gameName',
                title: 'Game Title',
                sortable: true
              },
              {
                accessor: 'achievementCount',
                title: 'Achievement Count',
                sortable: true
              },
              {
                accessor: 'achievementsGained',
                title: 'Achievements Gained',
                sortable: true
              },
              {
                accessor: 'percentageCompleted',
                title: 'Percentage Completed',
                sortable: true,

                render: ({ percentageCompleted }) => (
                  <Text>{percentageCompleted as string}%</Text>
                )
              },
              {
                accessor: 'gameGenre',
                title: 'Game Genre',
                sortable: true
              },
              {
                accessor: 'players',
                title: 'Players',
                sortable: true
              }
            ]}
            totalRecords={totalRecords}
            recordsPerPage={pageSize}
            page={page}
            onPageChange={(p) => { setPage(p) }}
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            recordsPerPageOptions={[5, 15, 25, 50]}
            onRecordsPerPageChange={setPageSize}
            onRowClick={async ({ record }) => { await GetGameInfoForModal(record.gameId as number) }}
          />
        </div>
      </Paper>

      <LoggedInModal gameInfo={loggedInGameModalData} onCloseModal={() => { setLoggedInGameModalData(undefined) }} updateTableData={async () => { if (props.updateTableData !== undefined) { await props.updateTableData() } }} />

    </>
  )
}

export default LoggedInGamesTable
