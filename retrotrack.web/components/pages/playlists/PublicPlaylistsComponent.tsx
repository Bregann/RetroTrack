'use client'

import { Button, Card, Container, Grid, Group, Stack, Text, Input, Pagination, Select, Paper } from '@mantine/core'
import { useMediaQuery, useDebouncedState } from '@mantine/hooks'
import { IconHeart, IconSearch, IconLogin } from '@tabler/icons-react'
import { pressStart2P } from '@/font/pressStart2P'
import styles from '@/css/pages/playlists.module.scss'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPlaylistResponse } from '@/interfaces/api/playlists/GetPlaylistResponse'
import { PlaylistCard } from '@/components/playlists/PlaylistCard'
import LoginModal from '@/components/navigation/LoginModal'

export default function LoggedOutPlaylistsComponent() {
  const isSm = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1200px)')
  const isXl = useMediaQuery('(min-width: 1600px)')
  const isXxl = useMediaQuery('(min-width: 2000px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const span = isXxl ? 2 : isXl ? 3 : isLg ? 4 : isSm ? 6 : 12

  const [searchInput, setSearchInput] = useDebouncedState<string | null>(null, 200)
  const [searchTerm, setSearchTerm] = useState<string | null>(null)
  const [searchDropdownValue, setSearchDropdownValue] = useState<string>('0')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const { data, isLoading, isError } = useQuery<GetPlaylistResponse>({
    queryKey: ['getPublicPlaylists'],
    queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetPublicPlaylists'),
    staleTime: 60000
  })

  const [loginModalOpened, setLoginModalOpened] = useState(false)

  const searchDropdownOptions = [
    { value: '0', label: 'Playlist Name' },
    { value: '1', label: 'Creator' },
    { value: '2', label: 'Description' }
  ]

  const filteredAndSortedPlaylists = useMemo(() => {
    if (data === undefined || data === null || data.playlists === undefined) return []

    let playlists = [...data.playlists]

    if (searchTerm !== null && searchTerm.trim() !== '') {
      playlists = playlists.filter(playlist => {
        const searchLower = searchTerm.toLowerCase()
        switch (searchDropdownValue) {
          case '0': // Playlist Name
            return playlist.name.toLowerCase().includes(searchLower)
          case '1': // Creator
            return playlist.createdBy.toLowerCase().includes(searchLower)
          case '2': // Description
            return playlist.description.toLowerCase().includes(searchLower)
          default:
            return playlist.name.toLowerCase().includes(searchLower)
        }
      })
    }

    const sorted = playlists.sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.numberOfLikes - a.numberOfLikes
        case 'title':
          return a.name.localeCompare(b.name)
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return sorted
  }, [data, searchTerm, searchDropdownValue, sortBy])

  const totalPages = Math.ceil(filteredAndSortedPlaylists.length / itemsPerPage)
  const paginatedPlaylists = filteredAndSortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSortChange = (value: string | null) => {
    if (value !== null && value.trim() !== '') {
      setSortBy(value as 'newest' | 'likes' | 'title' | 'oldest')
      setCurrentPage(1)
    }
  }

  if (isLoading) {
    return (
      <Container size="95%" py="md">
        <Text ta="center" size="lg">Loading playlists...</Text>
      </Container>
    )
  }

  if (isError || data === undefined || data === null) {
    return (
      <Container size="95%" py="md">
        <Text ta="center" size="lg" c="red">Error loading playlists. Please try again later.</Text>
      </Container>
    )
  }

  return (
    <Container size="95%" py="md">
      <Group justify="space-between" align="center" mb="lg">
        <Text
          size="28px"
          className={pressStart2P.className}
        >
          Community Playlists
        </Text>

        <Button
          leftSection={<IconLogin size={16} />}
          variant="filled"
          color="blue"
          size="md"
          className={styles.createButton}
          onClick={() => setLoginModalOpened(true)}
        >
          Sign Up / Log In to Create Playlists
        </Button>
      </Group>

      {/* Info Banner for Logged Out Users */}
      <Card className={styles.infoBanner} mb="lg" p="md">
        <Group>
          <IconHeart size={24} color="#1976d2" />
          <div>
            <Text size="md" fw={600}>
              Discover Amazing Game Playlists
            </Text>
            <Text size="sm" c="dimmed">
              Browse community-created playlists. Sign up to create your own, like playlists, and track your progress!
            </Text>
          </div>
        </Group>
      </Card>

      {/* Search Controls */}
      <Paper className={styles.searchContainer} mb="md" p="md">
        <Group
          justify="center"
          gap={isMobile ? 'xs' : 'md'}
          style={{ width: '100%' }}
        >
          <Input
            placeholder="Search playlists..."
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
            }}
          />
          <Select
            data={searchDropdownOptions}
            style={{
              flex: isMobile ? '0 0 120px' : '0 0 150px',
              minWidth: 0,
            }}
            clearable
            defaultValue={searchDropdownValue}
            onChange={(value) => setSearchDropdownValue(value ?? '0')}
          />
          <Button
            style={{ flex: '0 0 auto' }}
            size={isMobile ? 'sm' : 'md'}
            leftSection={<IconSearch size={16} />}
            onClick={() => {
              setSearchTerm(searchInput)
              setCurrentPage(1)
            }}
            disabled={searchInput === null || searchInput.trim() === ''}
          >
            {isMobile ? 'Go' : 'Search'}
          </Button>
        </Group>
      </Paper>

      {/* Sort Options as Buttons */}
      <Group mb="xl" gap="xs">
        <Text size="sm" c="dimmed" fw={500}>
          Sort by:
        </Text>
        <Group gap="xs">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'likes', label: 'Most Liked' },
            { value: 'title', label: 'A-Z' },
            { value: 'oldest', label: 'Oldest' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'filled' : 'light'}
              color={sortBy === option.value ? 'blue' : 'gray'}
              size="xs"
              onClick={() => handleSortChange(option.value)}
              className={styles.sortButton}
            >
              {option.label}
            </Button>
          ))}
        </Group>
      </Group>

      {/* Results info */}
      <Text size="sm" c="dimmed" mb="md">
        {filteredAndSortedPlaylists.length === data.playlists.length
          ? `Showing all ${data.playlists.length} community playlists`
          : `Showing ${filteredAndSortedPlaylists.length} of ${data.playlists.length} community playlists`}
      </Text>

      <Grid gutter={8}>
        {/* Show login prompt card on first page when no search */}
        {currentPage === 1 && (searchTerm === null || searchTerm.trim() === '') && (
          <Grid.Col span={span}>
            <Card
              className={styles.loginPromptCard}
              radius="md"
              p="lg"
              onClick={() => setLoginModalOpened(true)}
            >
              <Stack align="center" justify="center" h="100%" gap="md">
                <IconLogin size={48} className={styles.loginIcon} />
                <Text size="lg" fw={600} ta="center">
                  Create Your Own Playlists
                </Text>
                <Text size="sm" ta="center" c="dimmed">
                  Sign up or log in to create and manage your own game playlists
                </Text>
                <Button
                  variant="filled"
                  color="blue"
                  size="sm"
                  className={styles.loginButton}
                  onClick={() => setLoginModalOpened(true)}
                >
                  Sign Up / Log In
                </Button>
              </Stack>
            </Card>
          </Grid.Col>
        )}

        {paginatedPlaylists.map((playlist) => (
          <Grid.Col key={playlist.id} span={span}>
            <PlaylistCard
              id={playlist.id}
              title={playlist.name}
              username={playlist.createdBy}
              description={playlist.description}
              gameIcons={playlist.icons}
              likes={playlist.numberOfLikes}
              createdAt={playlist.createdAt}
              updatedAt={playlist.updatedAt}
              isPublic={playlist.isPublic}
            />
          </Grid.Col>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 &&
        <Group justify="center" mt="xl">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="md"
            className={styles.pagination}
          />
        </Group>
      }

      {/* No results message */}
      {filteredAndSortedPlaylists.length === 0 &&
        <Text ta="center" c="dimmed" mt="xl" size="lg">
          {(searchTerm !== null && searchTerm.trim() !== '') ? `No playlists found matching "${searchTerm}"` : 'No playlists found.'}
        </Text>
      }

    <LoginModal openedState={loginModalOpened} onClose={() => { setLoginModalOpened(false) }} />
    </Container>
  )
}
