
'use client'

import { useState, useMemo } from 'react'
import { Button, Center, Container, Group, Input, Loader, Paper, Select, Text } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import type { Game, GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { useDebouncedState } from '@mantine/hooks'
import { useGameModal } from '@/context/gameModalContext'
import { Press_Start_2P } from 'next/font/google'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import Loading from '@/app/loading'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})


interface PublicGamesTableProps {
  consoleId: number
  showConsoleColumn?: boolean
}

const baseColumns: Column<Game>[] = [
  {
    title: '',
    key: 'gameImageUrl',
    render: (item) => {
      return (
        <Image
          src={`https://media.retroachievements.org${item.gameImageUrl}`}
          alt={`${item.gameTitle} achievement icon`}
          width={64}
          height={64}
          className={styles.roundedImage}
        />
      )
    }
  },
  {
    title: 'Game Title',
    key: 'gameTitle',
    sortable: true
  },
  {
    title: 'Genre',
    key: 'gameGenre',
    sortable: true
  },
  {
    title: 'Achievements',
    key: 'achievementCount',
    sortable: true,
    toggleDescFirst: true
  },
  {
    title: 'Points',
    key: 'points',
    sortable: true,
    toggleDescFirst: true
  },
  {
    title: 'Players',
    key: 'playerCount',
    sortable: true,
    toggleDescFirst: true
  }
]

export default function PublicGamesTable(props: PublicGamesTableProps) {
  // Create a fresh copy of columns for this component instance
  const columns = useMemo(() => {
    const cols = [...baseColumns]

    // Add console column only if showConsoleColumn is true and consoleId is -1
    if (props.showConsoleColumn === true && props.consoleId === -1) {
      cols.push({
        title: 'Console',
        key: 'consoleName',
        sortable: true,
        show: true
      })
    }

    return cols
  }, [props.showConsoleColumn, props.consoleId])

  const [page, setPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption<Game>>({
    key: 'gameTitle',
    direction: 'asc',
  })

  const [searchInput, setSearchInput] = useDebouncedState<string | null>(null, 200)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')

  const queryString = useMemo(() => {
    const skip = (page - 1) * 100
    const take = 100
    const sortKeyMap: Record<string, string> = {
      gameTitle: 'SortByName',
      gameGenre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      playerCount: 'SortByPlayerCount',
      points: 'SortByPoints',
      consoleName: 'SortByConsole'
    }

    const sortParam = sortKeyMap[sortOption.key] !== undefined ? sortKeyMap[sortOption.key] : 'SortByName'
    const sortValue = sortOption.direction === 'asc'

    let query = `ConsoleId=${props.consoleId}&Skip=${skip}&Take=${take}&${sortParam}=${sortValue}`

    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [page, props.consoleId, searchDropdownValue, searchTerm, sortOption.direction, sortOption.key])

  const { data, isLoading, isError, error } = useQuery<GetGamesForConsoleResponse>({
    queryKey: [queryString],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetGamesForConsoleResponse>('/api/games/getGamesForConsole?'.concat(queryString))
  })

  const gameModal = useGameModal()

  const searchDropdownOptions = [
    { value: '0', label: 'Game Title' },
    { value: '1', label: 'Genre' },
    { value: '2', label: 'Achievement Name' },
    { value: '3', label: 'Achievement Description' }
  ]

  const totalPages = data?.totalPages ?? 0



  return (
    <Container size="95%">
      {isLoading &&
        <Loading />
      }
      {isError &&
        <div>
          Error: {error.message}
        </div>
      }
      {data !== undefined &&
        <>
          <Container ta="center" py="xs">
            <Text
              size={'28px'}
              mt={'md'}
              ta="center"
              className={pressStart2P.className}
            >{data.consoleName}</Text>
            <Text mb="xs">There are a total of {data.totalCount} games!</Text>
          </Container>

          <Paper className={styles.paper}>
            <Group
              justify="center"
              mt={10}
              mb={10}
              pr={20}
              pl={20}
              style={{ width: '100%' }}
            >
              <Input
                placeholder="Search..."
                style={{
                  flex: 1,
                  minWidth: 0,
                }}
                onChange={(e) => {
                  if (e.currentTarget.value.trim() === '') {
                    setSearchTerm(null)
                    setSearchInput(null)
                  }
                  setSearchInput(e.currentTarget.value)
                }
                }
              />
              <Select
                data={searchDropdownOptions}
                style={{
                  flex: '0 0 150px',
                  minWidth: 0,
                }}
                clearable
                defaultValue={searchDropdownValue}
                onChange={(value) => setSearchDropdownValue(value ?? '0')}
              />
              <Button style={{ flex: '0 0 auto', ml: 10 }}
                onClick={() => { setSearchTerm(searchInput) }}
                disabled={searchInput === null || searchInput.trim() === ''}
              >
                Search
              </Button>
            </Group>

            {isLoading ? (
              <Center style={{ padding: '2rem' }}>
                <Loader variant="dots" size="lg" />{/* or variant="bars", "oval"—choose your vibe */}
                <p style={{ marginLeft: 10 }}>Loading games...</p>
              </Center>
            ) : isError ? (
              <p style={{ color: 'red' }}>Oops: {error.message}</p>
            ) : (
              <PaginatedTable
                data={data!.games}
                columns={columns}
                page={page}
                total={totalPages}
                sortOption={sortOption}
                onSortChange={(opt) => {
                  setPage(1)
                  setSortOption(opt)
                }}
                onPageChange={setPage}
                onRowClick={(item) => {
                  gameModal.showModal(item.gameId)
                }}
              />
            )}
          </Paper>
        </>
      }

    </Container>
  )
}
