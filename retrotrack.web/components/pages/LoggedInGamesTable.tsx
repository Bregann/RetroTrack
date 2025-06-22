
'use client'

import { useState, useMemo } from 'react'
import { Badge, Button, Center, Checkbox, Container, Group, Input, Loader, Paper, Select } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import { useLoggedInPaginatedTableQuery } from '@/hooks/consoles/useLoggedInPaginatedTableQuery'
import type { LoggedInGame, GetUserProgressForConsoleResponse } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { useDebouncedState } from '@mantine/hooks'
import { useGameModal } from '@/context/gameModalContext'
import { HighestAwardKind } from '@/enums/highestAwardKind'

interface LoggedInGamesTableProps {
  pageData: GetUserProgressForConsoleResponse
  consoleId: number
  consoleName: string
  totalGames: number
}

const columns: Column<LoggedInGame>[] = [
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
  },
  {
    title: 'Achievements Unlocked',
    key: 'achievementsUnlocked',
    sortable: true,
    toggleDescFirst: true
  },
  {
    title: 'Percent Complete',
    key: 'percentageComplete',
    sortable: true,
    render: (item) => {
      return `${item.percentageComplete}%`
    },
    toggleDescFirst: true
  },
  {
    title: 'Highest Award',
    key: 'highestAward',
    render: (item) => {
      switch (item.highestAward){
        case HighestAwardKind.BeatenSoftcore:
          return <Badge color="teal" variant="light">Beaten (Softcore)</Badge>
        case HighestAwardKind.BeatenHardcore:
          return <Badge color="cyan" variant="light">Beaten (Hardcore)</Badge>
        case HighestAwardKind.Completed:
          return <Badge color="orange" variant="light">Completed</Badge>
        case HighestAwardKind.Mastered:
          return <Badge color="yellow" variant="filled" style={{ whiteSpace: 'normal', overflow: 'visible' }}>Mastered</Badge>
        case HighestAwardKind.Unknown:
          return ''
        default:
          return ''
      }
    }
  }
]

export default function LoggedInGamesTable(props: LoggedInGamesTableProps) {
  if (columns.find(c => c.key === 'consoleName') === undefined) {
    columns.push({
      title: 'Console',
      key: 'consoleName',
      sortable: props.consoleId === -1, // Only show if consoleId is -1
      show: props.consoleId === -1
    })
  }

  const [page, setPage] = useState(1)
  const [sortOption, setSortOption] = useState<SortOption<LoggedInGame>>({
    key: 'gameTitle',
    direction: 'asc',
  })

  const [searchInput, setSearchInput] = useDebouncedState<string | null>(null, 200)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')
  const [hideInProgressGames, setHideInProgressGames] = useState(false)
  const [hideBeatenGames, setHideBeatenGames] = useState(false)
  const [hideCompletedGames, setHideCompletedGames] = useState(false)

  const queryString = useMemo(() => {
    const skip = (page - 1) * 100
    const take = 100
    const sortKeyMap: Record<string,string> = {
      gameTitle: 'SortByName',
      gameGenre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      playerCount: 'SortByPlayerCount',
      points: 'SortByPoints',
      consoleName: 'SortByConsole',
      achievementsUnlocked: 'SortByAchievementsUnlocked',
      percentageComplete: 'SortByPercentageComplete'
    }

    const sortParam = sortKeyMap[sortOption.key] || 'SortByName'
    const sortValue = sortOption.direction === 'asc'

    let query = `ConsoleId=${props.consoleId}&Skip=${skip}&Take=${take}&${sortParam}=${sortValue}${hideBeatenGames ? '&HideBeatenGames=true' : ''}${hideCompletedGames ? '&HideCompletedGames=true' : ''}${hideInProgressGames ? '&HideInProgressGames=true' : ''}`

    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [hideBeatenGames, hideCompletedGames, hideInProgressGames, page, props.consoleId, searchDropdownValue, searchTerm, sortOption.direction, sortOption.key])

  const isFirstLoad = queryString === `ConsoleId=${props.consoleId}&Skip=0&Take=100&SortByName=true`

  const { data, isLoading, isError, error } = useLoggedInPaginatedTableQuery(
    queryString,
    isFirstLoad ? props.pageData : undefined
  )

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
      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h1 style={{ marginBottom: '0rem' }}>{props.consoleName}</h1>
        <p style={{ marginTop: 0 }}>There are a total of {props.totalGames} games!</p>
      </div>

      <Paper className={styles.paper}>
        {isLoading ? (
          <Center style={{ padding: '2rem' }}>
            <Loader variant="dots" size="lg" />{/* or variant="bars", "oval"—choose your vibe */}
            <p style={{ marginLeft: 10 }}>Loading games...</p>
          </Center>
        ) : isError ? (
          <p style={{ color: 'red' }}>Oops: {error.message}</p>
        ) : (
          <>
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
            <Group ml={20}>
              <Checkbox checked={hideInProgressGames} label="Hide In-Progress Games" onChange={() => { setHideInProgressGames(!hideInProgressGames) }}/>
              <Checkbox checked={hideBeatenGames} label="Hide Beaten Games" onChange={() => { setHideBeatenGames(!hideBeatenGames) }}/>
              <Checkbox checked={hideCompletedGames} label="Hide Completed/Mastered Games" onChange={() => { setHideCompletedGames(!hideCompletedGames) }}/>
            </Group>
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
          </>

        )}
      </Paper>
    </Container>
  )
}
