import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import Image from 'next/image'
import { Group, LoadingOverlay, Paper, TextInput, UnstyledButton } from '@mantine/core'
import { useEffect, useState } from 'react'
import sortBy from 'lodash/sortBy'
import { useDebouncedValue } from '@mantine/hooks'
import LoggedOutModal from './LoggedOutModal'
import { type GetSpecificGameInfo } from '@/pages/api/games/GetSpecificGameInfo'
import fetchHelper from '@/helpers/FetchHelper'
import notificationHelper from '@/helpers/NotificationHelper'
import { IconCrossFilled, IconSearch, IconSquareX } from '@tabler/icons-react'

export interface PublicGame {
  gameId: number
  gameIconUrl: string
  gameName: string
  achievementCount: number
  gameGenre: string
  players: number
}

interface PublicGameTableProps {
  gameData: PublicGame[]
}

const PublicGamesTable = (props: PublicGameTableProps): JSX.Element => {
  const [pageSize, setPageSize] = useState(15)
  const [page, setPage] = useState(1)
  const [games, setGames] = useState(sortBy(props.gameData.slice(0, pageSize), 'gameName'))
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'gameName', direction: 'asc' })
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 200)
  const [totalRecords, setTotalRecords] = useState(props.gameData.length)
  const [loggedOutGameModalData, setLoggedOutGameModalData] = useState<GetSpecificGameInfo | undefined>(undefined)
  const [loadingOverlayVisible, setLoadingOverlayVisible] = useState(false)
  console.log(props.gameData)
  useEffect(() => {
    const from = (page - 1) * pageSize
    const to = from + pageSize

    const data = sortBy(props.gameData, sortStatus.columnAccessor)
    const sortedData = sortStatus.direction === 'desc' ? data.reverse() : data

    const filteredGames = sortedData.filter(({ gameName, achievementCount, gameGenre, players }) => {
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

    setTotalRecords(filteredGames.length)
    setGames(filteredGames.slice(from, to))
  }, [page, props.gameData, sortStatus, pageSize, debouncedQuery])

  const GetGameInfoForModal = async (gameId: number): Promise<void> => {
    setLoadingOverlayVisible(true)
    const res = await fetchHelper.doGet('/games/GetSpecificGameInfo?gameId=' + gameId)

    if (res.errored) {
      notificationHelper.showErrorNotification('Error', 'There has been an error trying to get the game data. Please try again', 5000, <IconCrossFilled />)
    } else {
      setLoggedOutGameModalData(res.data)
    }

    setLoadingOverlayVisible(false)
  }

  return (
    <>
      <Paper shadow="md" p="md" withBorder mt={15}>
        <Group>
          <TextInput
            style={{ width: '100%', marginBottom: 20 }}
            placeholder="Search games..."
            leftSection={<IconSearch size={16} />}
            value={query}
            onChange={(e) => { setQuery(e.currentTarget.value) }}
          />
          <UnstyledButton style={{ marginBottom: 21, marginLeft: -45, zIndex: 1 }} onClick={() => { setQuery('') }}>
            <IconSquareX size={20} />
          </UnstyledButton>
        </Group>
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loadingOverlayVisible} />
          <DataTable
            striped
            highlightOnHover
            highlightOnHoverColor='#4DABF775'
            records={games as any} // I hate this with a passion
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

      <LoggedOutModal gameInfo={loggedOutGameModalData} onClose={() => { setLoggedOutGameModalData(undefined) }} />
    </>
  )
}

export default PublicGamesTable
