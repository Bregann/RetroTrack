
'use client'
import { useState, useMemo } from 'react'
import { Button, Center, Container, Group, Input, Loader, Paper, Select } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import { PublicGameTableColumns } from '@/interfaces/pages/PublicGameTableColumns'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import { usePublicPaginatedTableQuery } from '@/hooks/consoles/usePublicPaginatedTableQuery'
import type { Game, GetGamesForConsoleResponse } from '@/interfaces/api/gamess/GetGamesForConsoleResponse'
import { useDebouncedState } from '@mantine/hooks'

interface PublicGamesTableProps {
  pageData: GetGamesForConsoleResponse
  consoleId: number
  consoleName: string
  totalGames: number
}

const columns: Column<PublicGameTableColumns>[] = [
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
    sortable: true
  },
  {
    title: 'Points',
    key: 'points',
    sortable: true,
  },
  {
    title: 'Players',
    key: 'playerCount',
    sortable: true
  }
]

export default function PublicGamesTable(props: PublicGamesTableProps) {
  if (columns.find(c => c.key === 'consoleName') === undefined) {
    columns.push({
      title: 'Console',
      key: 'consoleName',
      sortable: props.consoleId === -1, // Only show if consoleId is -1
      show: props.consoleId === -1
    })
  }

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
    const sortKeyMap: Record<string,string> = {
      gameTitle: 'SortByName',
      gameGenre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      playerCount: 'SortByPlayerCount',
      points: 'SortByPoints',
      consoleName: 'SortByConsole'
    }
    const sortParam = sortKeyMap[sortOption.key] || 'SortByName'
    const sortValue = sortOption.direction === 'asc'
    let query = `ConsoleId=-1&Skip=${skip}&Take=${take}&${sortParam}=${sortValue}`
    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }
    return query
  }, [page, searchDropdownValue, searchTerm, sortOption.direction, sortOption.key])

  const isFirstLoad = queryString === 'ConsoleId=-1&Skip=0&Take=100&SortByName=true'

  const { data, isLoading, isError, error } = usePublicPaginatedTableQuery(
    queryString,
    isFirstLoad ? props.pageData : undefined
  )

  const searchDropdownOptions = [
    { value: '0', label: 'Game Title' },
    { value: '1', label: 'Genre' },
    { value: '2', label: 'Achievement Name' },
    { value: '3', label: 'Achievement Description' }
  ]

  const totalPages = data?.totalPages ?? 0

  return (
    <Container size="95%">
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ marginBottom: '0rem' }}>{props.consoleName}</h1>
        <p style={{ marginTop: 0 }}>There are a total of {props.totalGames} games!</p>
      </div>

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
            onChange={(e) =>{
              if(e.currentTarget.value.trim() === '') {
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
            onClick={() => {setSearchTerm(searchInput)}}
            disabled={!searchInput || searchInput.trim() === ''}
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
          />
        )}
      </Paper>
    </Container>
  )
}
