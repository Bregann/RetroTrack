
'use client'

import { useState, useMemo } from 'react'
import { Badge, Button, Center, Container, Group, Loader, Paper, Select, Text, Title, TextInput, ActionIcon } from '@mantine/core'
import PaginatedTable, { Column, SortOption } from '../../shared/PaginatedTable'
import Image from 'next/image'
import styles from '@/css/components/publicGamesTable.module.scss'
import type { Game, GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import { useMediaQuery } from '@mantine/hooks'
import { useGameModal } from '@/context/gameModalContext'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import Loading from '@/app/loading'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pressStart2P } from '@/font/pressStart2P'
import { IconX } from '@tabler/icons-react'

interface PublicGamesTableProps {
  consoleId: number
  showConsoleColumn?: boolean
}

const baseColumns: Column<Game>[] = [
  {
    title: '',
    key: 'gameImageUrl',
    render: (item) => {
      // Note: responsive sizing is handled via CSS classes
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
    sortable: true,
    render: (item) => {
      const genres = item.gameGenre.split(',').map(g => g.trim()).filter(g => g.length > 0)
      return (
        <div style={{ minWidth: '140px', maxWidth: '200px' }}>
          <Group gap="xs" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            {genres.map((genre, index) => (
              <Badge key={index} color="blue" variant="light" size="sm">
                {genre}
              </Badge>
            ))}
          </Group>
        </div>
      )
    }
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

]

export default function PublicGamesTable(props: PublicGamesTableProps) {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [sortOption, setSortOption] = useState<SortOption<Game>>({
    key: 'gameTitle',
    direction: 'asc',
  })

  const [searchInput, setSearchInput] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')

  // Create a fresh copy of columns for this component instance
  const columns = useMemo(() => {
    const cols = [...baseColumns]

    // Add genre render function with click handlers
    const genreColIndex = cols.findIndex(col => col.key === 'gameGenre')
    if (genreColIndex !== -1) {
      cols[genreColIndex] = {
        ...cols[genreColIndex],
        render: (item) => {
          const genres = item.gameGenre.split(',').map(g => g.trim()).filter(g => g.length > 0)
          return (
            <div style={{ minWidth: '140px', maxWidth: '200px' }}>
              <Group gap="xs" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                {genres.map((genre, index) => (
                  <Badge
                    key={index}
                    color="blue"
                    variant="light"
                    size="sm"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent row click
                      setSearchDropdownValue('1') // Set to Genre
                      setSearchTerm(genre)
                      setSearchInput(genre)
                      setPage(1) // Reset to first page
                    }}
                  >
                    {genre}
                  </Badge>
                ))}
              </Group>
            </div>
          )
        }
      }
    }

    // Add console column only if showConsoleColumn is true and consoleId is -1
    if (props.showConsoleColumn === true && props.consoleId === -1) {
      cols.push({
        title: 'Console',
        key: 'consoleName',
        sortable: true
      })
    }

    return cols
  }, [props.showConsoleColumn, props.consoleId])

  const queryString = useMemo(() => {
    const skip = (page - 1) * pageSize
    const take = pageSize
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
  }, [page, pageSize, props.consoleId, searchDropdownValue, searchTerm, sortOption.direction, sortOption.key])

  const { data, isLoading, isError, error } = useQuery<GetGamesForConsoleResponse>({
    queryKey: [queryString.concat('-public')],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetGamesForConsoleResponse>('/api/games/getGamesForConsole?'.concat(queryString))
  })

  const gameModal = useGameModal()
  const router = useRouter()

  const searchDropdownOptions = [
    { value: '0', label: 'Game Title' },
    { value: '1', label: 'Genre' },
    { value: '2', label: 'Achievement Name' },
    { value: '3', label: 'Achievement Description' }
  ]

  const totalPages = data?.totalPages ?? 0

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
            >{data.consoleName}</Text>
            <Text mb="xs" size={isMobile ? 'sm' : 'md'}>There are a total of {data.totalCount} games!</Text>
          </Container>

          <Paper className={styles.paper}>
            <Group
              justify="center"
              mt={10}
              mb={10}
              pr={isMobile ? 10 : 20}
              pl={isMobile ? 10 : 20}
              style={{ width: '100%' }}
              gap={isMobile ? 'xs' : 'md'}
            >
              <TextInput
                placeholder="Search..."
                value={searchInput}
                style={{
                  flex: 1,
                  minWidth: isMobile ? 150 : 200,
                }}
                onChange={(e) => {
                  const value = e.currentTarget.value
                  setSearchInput(value)
                  if (value.trim() === '') {
                    setSearchTerm(null)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchInput.trim() !== '') {
                    setSearchTerm(searchInput.trim())
                  }
                }}
                rightSection={
                  searchInput !== '' ? (
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      onClick={() => {
                        setSearchInput('')
                        setSearchTerm(null)
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  ) : null
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
                onClick={() => { setSearchTerm(searchInput.trim() !== '' ? searchInput.trim() : null) }}
                disabled={searchInput.trim() === ''}
              >
                {isMobile ? 'Go' : 'Search'}
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
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => {
                  setPageSize(newPageSize)
                  setPage(1) // Reset to first page when changing page size
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                showPageSizeSelector={true}
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
              />
            )}
          </Paper>
        </>
      }

    </Container>
  )
}
