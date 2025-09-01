'use client'

import { Button, Card, Container, Grid, Group, Stack, Tabs, Text, TextInput, Pagination, ActionIcon } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconPlus, IconUsers, IconSearch, IconX, IconHeart } from '@tabler/icons-react'
import { pressStart2P } from '@/font/pressStart2P'
import styles from '@/css/pages/playlists.module.scss'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPlaylistResponse, PlaylistItem } from '@/interfaces/api/playlists/GetPlaylistResponse'
import { PlaylistCard } from '@/components/playlists/PlaylistCard'
import CreatePlaylistModal from '@/components/playlists/CreatePlaylistModal'

export default function LoggedInPlaylistsComponent() {
  const isSm = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1200px)')
  const isXl = useMediaQuery('(min-width: 1600px)')
  const isXxl = useMediaQuery('(min-width: 2000px)')

  const span = isXxl ? 2 : isXl ? 3 : isLg ? 4 : isSm ? 6 : 12

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('my-playlists')
  const [createModalOpened, setCreateModalOpened] = useState(false)
  const itemsPerPage = 12

  const { data: userPlaylistsData, isLoading: userPlaylistsLoading } = useQuery<GetPlaylistResponse>({
    queryKey: ['getUserPlaylists'],
    queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetUserPlaylists'),
    staleTime: 60000
  })

  const { data: publicPlaylistsData, isLoading: publicPlaylistsLoading } = useQuery<GetPlaylistResponse>({
    queryKey: ['getPublicPlaylists'],
    queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetPublicPlaylists'),
    staleTime: 60000
  })

  const { data: likedPlaylistsData, isLoading: likedPlaylistsLoading } = useQuery<GetPlaylistResponse>({
    queryKey: ['getUserLikedPlaylists'],
    queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetUserLikedPlaylists'),
    staleTime: 60000
  })

  // Filter and sort logic
  const filteredAndSortedPlaylists = useMemo(() => {
    // Get the correct playlists array from the query data
    const playlists: PlaylistItem[] =
      activeTab === 'my-playlists'
        ? userPlaylistsData?.playlists ?? []
        : activeTab === 'all-likes'
        ? likedPlaylistsData?.playlists ?? []
        : publicPlaylistsData?.playlists ?? []

    // Apply search filter
    const filtered = searchQuery.trim() !== ''
      ? playlists.filter(playlist =>
          playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : playlists

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
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
  }, [activeTab, searchQuery, sortBy, userPlaylistsData, publicPlaylistsData, likedPlaylistsData])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedPlaylists.length / itemsPerPage)
  const paginatedPlaylists = filteredAndSortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset pagination when changing tabs or search
  const handleTabChange = (value: string | null) => {
    if (value?.trim() !== '') {
      setActiveTab(value as 'my-playlists' | 'public-playlists' | 'all-likes')
      setCurrentPage(1)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string | null) => {
    if (value?.trim() !== '') {
      setSortBy(value as 'newest' | 'likes' | 'title' | 'oldest')
      setCurrentPage(1)
    }
  }

  // Loading state
  if (userPlaylistsLoading || publicPlaylistsLoading || likedPlaylistsLoading) {
    return (
      <Container size="95%" py="md">
        <Text ta="center" size="lg">Loading playlists...</Text>
      </Container>
    )
  }

  if ( userPlaylistsData === undefined || publicPlaylistsData === undefined || likedPlaylistsData === undefined) {
    return (
      <Container size="95%" py="md">
        <Text ta="center" size="lg" c="red">Failed to load playlists. Please try again later.</Text>
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
          Playlists
        </Text>

        <Button
          leftSection={<IconPlus size={16} />}
          variant="filled"
          color="blue"
          size="md"
          className={styles.createButton}
          onClick={() => setCreateModalOpened(true)}
        >
          Create New Playlist
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={handleTabChange} className={styles.playlistTabs}>
        <Tabs.List mb="md">
          <Tabs.Tab value="my-playlists" leftSection={<IconUsers size={16} />}>
            My Playlists ({userPlaylistsData.playlists.length})
          </Tabs.Tab>
          <Tabs.Tab value="public-playlists" leftSection={<IconHeart size={16} />}>
            Public Playlists ({publicPlaylistsData.playlists.length})
          </Tabs.Tab>
          <Tabs.Tab value="all-likes" leftSection={<IconHeart size={16} />}>
            Liked Playlists ({likedPlaylistsData.playlists.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* Search Controls */}
        <Group mb="md" className={styles.searchContainer}>
          <Group style={{ flex: 1, maxWidth: 500 }} gap="xs">
            <TextInput
              placeholder="Search playlists..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                searchQuery.trim() !== '' ? (
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="gray"
                    onClick={() => handleSearchChange('')}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                ) : null
              }
              value={searchQuery}
              onChange={(event) => handleSearchChange(event.currentTarget.value)}
              className={styles.searchInput}
              style={{ flex: 1 }}
            />
          </Group>
        </Group>

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

        <Tabs.Panel value="my-playlists">
          <Text size="sm" c="dimmed" mb="md">
            {filteredAndSortedPlaylists.length === userPlaylistsData.playlists.length
              ? `Showing all ${userPlaylistsData.playlists.length} playlists`
              : `Showing ${filteredAndSortedPlaylists.length} of ${userPlaylistsData.playlists.length} playlists`}
          </Text>

          <Grid gutter={8}>
            {currentPage === 1 && searchQuery.trim() === '' && (
              <Grid.Col span={span}>
                <Card
                  className={styles.createPlaylistCard}
                  radius="md"
                  p="lg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCreateModalOpened(true)}
                >
                  <Stack align="center" justify="center" h="100%">
                    <IconPlus size={48} className={styles.createIcon} />
                    <Text size="lg" fw={600} ta="center">
                      Create a Playlist
                    </Text>
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

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="md"
                className={styles.pagination}
              />
            </Group>
          )}

          {filteredAndSortedPlaylists.length === 0 && (
            <Text ta="center" c="dimmed" mt="xl" size="lg">
              {searchQuery.trim() !== '' ? `No playlists found matching "${searchQuery}"` : 'No playlists found.'}
            </Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="public-playlists">
          <Text size="sm" c="dimmed" mb="md">
            {filteredAndSortedPlaylists.length === publicPlaylistsData.playlists.length
              ? `Showing all ${publicPlaylistsData.playlists.length} playlists`
              : `Showing ${filteredAndSortedPlaylists.length} of ${publicPlaylistsData.playlists.length} playlists`}
          </Text>

          <Grid gutter={8}>
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

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="md"
                className={styles.pagination}
              />
            </Group>
          )}

          {filteredAndSortedPlaylists.length === 0 && (
            <Text ta="center" c="dimmed" mt="xl" size="lg">
              {searchQuery.trim() !== '' ? `No playlists found matching "${searchQuery}"` : 'No playlists found.'}
            </Text>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="all-likes">
          <Text size="sm" c="dimmed" mb="md">
            {filteredAndSortedPlaylists.length === likedPlaylistsData.playlists.length
              ? `Showing all ${likedPlaylistsData.playlists.length} liked playlists`
              : `Showing ${filteredAndSortedPlaylists.length} of ${likedPlaylistsData.playlists.length} liked playlists`}
          </Text>

          <Grid gutter={8}>
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

          {totalPages > 1 && (
            <Group justify="center" mt="xl">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="md"
                className={styles.pagination}
              />
            </Group>
          )}

          {filteredAndSortedPlaylists.length === 0 && (
            <Text ta="center" c="dimmed" mt="xl" size="lg">
              {searchQuery.trim() !== '' ? `No liked playlists found matching "${searchQuery}"` : 'No liked playlists found.'}
            </Text>
          )}
        </Tabs.Panel>
      </Tabs>

      <CreatePlaylistModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
      />
    </Container>
  )
}
