'use client'

import { useState, useMemo } from 'react'
import { Badge, Button, Center, Checkbox, Container, Group, Input, Loader, Paper, Select, Text, Title } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../shared/PaginatedTable'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import type { LoggedInGame } from '@/interfaces/api/games/GetUserProgressForConsoleResponse'
import { useDebouncedState, useMediaQuery } from '@mantine/hooks'
import { useGameModal } from '@/context/gameModalContext'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import Loading from '@/app/loading'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pressStart2P } from '@/font/pressStart2P'

const columns: Column<LoggedInGame>[] = [
  {
    title: '',
    key: 'gameImageUrl',
    render: (item) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '64px' }}>
          <Image
            src={`https://media.retroachievements.org${item.gameImageUrl}`}
            alt={`${item.gameTitle} achievement icon`}
            width={64}
            height={64}
            className={styles.roundedImage}
          />
        </div>
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
      switch (item.highestAward) {
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
  },
  {
    title: 'Console',
    key: 'consoleName',
    sortable: true,
    show: true
  }
]

export default function TrackedGames() {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Hide certain columns on smaller screens
  const responsiveColumns = useMemo(() => {
    const cols = [...columns]
    if (isMobile) {
      // On mobile, hide genre and player count
      cols.forEach(col => {
        if (col.key === 'gameGenre' || col.key === 'playerCount') {
          col.show = false
        }
        // Also hide console column on mobile due to space constraints
        if (col.key === 'consoleName') {
          col.show = false
        }
      })
    }
    return cols
  }, [isMobile])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
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

  const router = useRouter()

  const queryString = useMemo(() => {
    const skip = (page - 1) * pageSize
    const take = pageSize
    const sortKeyMap: Record<string, string> = {
      gameTitle: 'SortByName',
      gameGenre: 'SortByGenre',
      achievementCount: 'SortByAchievementCount',
      playerCount: 'SortByPlayerCount',
      points: 'SortByPoints',
      consoleName: 'SortByConsole',
      achievementsUnlocked: 'SortByAchievementsUnlocked',
      percentageComplete: 'SortByPercentageComplete'
    }

    const sortParam = sortKeyMap[sortOption.key] !== undefined ? sortKeyMap[sortOption.key] : 'SortByName'
    const sortValue = sortOption.direction === 'asc'

    let query = `Skip=${skip}&Take=${take}&${sortParam}=${sortValue}${hideBeatenGames ? '&HideBeatenGames=true' : ''}${hideCompletedGames ? '&HideCompletedGames=true' : ''}${hideInProgressGames ? '&HideInProgressGames=true' : ''}`

    if (searchTerm !== null && searchTerm !== '') {
      query += `&SearchType=${searchDropdownValue}&SearchTerm=${encodeURIComponent(searchTerm)}`
    }

    return query
  }, [hideBeatenGames, hideCompletedGames, hideInProgressGames, page, pageSize, searchDropdownValue, searchTerm, sortOption.direction, sortOption.key])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [queryString],
    queryFn: async () => await doQueryGet<GetUserTrackedGamesResponse>(`/api/trackedgames/GetTrackedGamesForUser?${queryString}`, { next: { revalidate: 60 } }),
    staleTime: 60000,
  })

  const gameModal = useGameModal()

  const searchDropdownOptions = [
    { value: '0', label: 'Game Title' },
    { value: '1', label: 'Genre' },
    { value: '2', label: 'Achievement Name' },
    { value: '3', label: 'Achievement Description' }
  ]

  return (
    <Container size={isMobile ? '100%' : '95%'}>
      {isLoading &&
        <Loading />
      }
      {isError &&
        <Container ta="center">
          <Title order={2} pt="xl">Error</Title>
          <Text pb="lg">Sorry about that, we couldn&apos;t load the game data, try again later.</Text>
          <Button size="md" radius="md" variant="light" component={Link} href={'/home'}>Head Home</Button>
        </Container>
      }
      {data !== undefined &&
        <>
          <Container ta="center" py="xs">
            <Text
              size={isMobile ? '20px' : '28px'}
              mt={'md'}
              ta="center"
              className={pressStart2P.className}
            >Tracked Games</Text>
            <Text mb="xs" size={isMobile ? 'sm' : 'md'}>There are a total of {data.totalCount} games!</Text>
          </Container>

          <Paper className={styles.paper}>
            {isLoading ? (
              <Center style={{ padding: '2rem' }}>
                <Loader variant="dots" size="lg" />
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
                  pr={isMobile ? 10 : 20}
                  pl={isMobile ? 10 : 20}
                  style={{ width: '100%' }}
                  gap={isMobile ? 'xs' : 'md'}
                >
                  <Input
                    placeholder="Search..."
                    style={{
                      flex: 1,
                      minWidth: isMobile ? 150 : 200,
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
                      flex: isMobile ? '0 0 100px' : '0 0 150px',
                      minWidth: 0,
                    }}
                    clearable
                    defaultValue={searchDropdownValue}
                    onChange={(value) => setSearchDropdownValue(value ?? '0')}
                  />
                  <Button
                    style={{ flex: '0 0 auto' }}
                    size={isMobile ? 'sm' : 'md'}
                    onClick={() => { setSearchTerm(searchInput) }}
                    disabled={searchInput === null || searchInput.trim() === ''}
                  >
                    {isMobile ? 'Go' : 'Search'}
                  </Button>
                </Group>
                <Group ml={20}>
                  <Checkbox checked={hideInProgressGames} label="Hide In-Progress Games" onChange={() => { setHideInProgressGames(!hideInProgressGames) }} />
                  <Checkbox checked={hideBeatenGames} label="Hide Beaten Games" onChange={() => { setHideBeatenGames(!hideBeatenGames) }} />
                  <Checkbox checked={hideCompletedGames} label="Hide Completed/Mastered Games" onChange={() => { setHideCompletedGames(!hideCompletedGames) }} />
                </Group>
                <PaginatedTable
                  data={data!.games}
                  columns={responsiveColumns}
                  page={page}
                  total={data.totalCount}
                  sortOption={sortOption}
                  onSortChange={(opt) => {
                    setPage(1)
                    setSortOption(opt)
                  }}
                  onPageChange={setPage}
                  onRowClick={(item) => {
                    gameModal.showModal(item.gameId)
                  }}
                  actions={[
                  {
                    onClick: (item) => gameModal.showModal(item.gameId),
                    label: 'Game Modal',
                    variant: 'filled'
                  },
                  {
                    onClick: (item) => router.push(`/game/${item.gameId}`),
                    label: 'Game Page',
                    variant: 'filled'
                  }
                ]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize)
                  setPage(1) // Reset to first page when changing page size
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                showPageSizeSelector={true}
                />
              </>
            )}
          </Paper>
        </>
      }
    </Container>
  )
}
