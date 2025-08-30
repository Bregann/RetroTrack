'use client'

import { Badge, Button, Card, Container, Grid, Group, Stack, Tabs, Text, TextInput, Pagination, ActionIcon } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconHeart, IconPlus, IconUsers, IconSearch, IconX } from '@tabler/icons-react'
import { pressStart2P } from '@/font/pressStart2P'
import styles from '@/css/pages/playlists.module.scss'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// Dummy data for user's playlists
const myPlaylists = [
  {
    id: 1,
    title: 'RPG Favorites',
    username: 'CurrentUser',
    likes: 45,
    isPublic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-20',
    description: 'My all-time favorite RPGs, featuring epic stories and memorable characters.',
    gameIcons: [
      'https://media.retroachievements.org/Images/085573.png',
      'https://media.retroachievements.org/Images/085574.png',
      'https://media.retroachievements.org/Images/085575.png',
      'https://media.retroachievements.org/Images/085576.png'
    ]
  },
  {
    id: 2,
    title: 'Speedrun Practice',
    username: 'CurrentUser',
    likes: 23,
    isPublic: false,
    createdAt: '2024-03-01',
    updatedAt: '2024-08-15',
    description: 'Games I\'m practicing for speedruns. Private collection to track my progress.',
    gameIcons: [
      'https://media.retroachievements.org/Images/085577.png',
      'https://media.retroachievements.org/Images/085578.png',
      'https://media.retroachievements.org/Images/085579.png'
    ]
  },
  {
    id: 3,
    title: 'Childhood Memories',
    username: 'CurrentUser',
    likes: 67,
    isPublic: true,
    createdAt: '2024-05-20',
    updatedAt: '2024-08-10',
    description: 'A nostalgic collection of games that defined my childhood. Pure retro joy!',
    gameIcons: [
      'https://media.retroachievements.org/Images/085580.png',
      'https://media.retroachievements.org/Images/085581.png',
      'https://media.retroachievements.org/Images/085582.png',
      'https://media.retroachievements.org/Images/085583.png'
    ]
  }
]

// Import public playlists from the main component (you might want to move this to a shared file)
const publicPlaylists = [
  {
    id: 4,
    title: 'Cozy RPG Evenings',
    username: 'Guinea',
    likes: 92,
    isPublic: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-08-20',
    gameIcons: [
      'https://media.retroachievements.org/Images/085573.png',
      'https://media.retroachievements.org/Images/085574.png',
      'https://media.retroachievements.org/Images/085575.png',
      'https://media.retroachievements.org/Images/085576.png'
    ]
  },
  {
    id: 5,
    title: 'Hard Mode Only',
    username: 'Guinea',
    likes: 30,
    isPublic: true,
    createdAt: '2024-02-10',
    updatedAt: '2024-08-15',
    gameIcons: [
      'https://media.retroachievements.org/Images/085577.png',
      'https://media.retroachievements.org/Images/085578.png',
      'https://media.retroachievements.org/Images/085579.png',
      'https://media.retroachievements.org/Images/085580.png'
    ]
  },
  {
    id: 6,
    title: 'Classic Platformers',
    username: 'Guinea',
    likes: 69,
    isPublic: true,
    createdAt: '2024-03-01',
    updatedAt: '2024-08-10',
    gameIcons: [
      'https://media.retroachievements.org/Images/085581.png',
      'https://media.retroachievements.org/Images/085582.png',
      'https://media.retroachievements.org/Images/085583.png',
      'https://media.retroachievements.org/Images/085584.png'
    ]
  }
]

interface PlaylistCardProps {
  playlist: {
    id: number
    title: string
    username: string
    likes: number
    isPublic: boolean
    gameIcons: string[]
    createdAt?: string
    updatedAt?: string
    description?: string
  }
  showCreateCard?: boolean
}

function PlaylistCard({ playlist, showCreateCard = false }: PlaylistCardProps) {
  const router = useRouter()

  if (showCreateCard) {
    return (
      <Card
        className={styles.createPlaylistCard}
        radius="md"
        p="lg"
        style={{ cursor: 'pointer' }}
        onClick={() => {
          // TODO: Open create playlist modal
          console.log('Create playlist clicked')
        }}
      >
        <Stack align="center" justify="center" h="100%">
          <IconPlus size={48} className={styles.createIcon} />
          <Text size="lg" fw={600} ta="center">
            Create a Playlist
          </Text>
        </Stack>
      </Card>
    )
  }

  return (
    <Card
      className={styles.playlistCard}
      radius="md"
      p={0}
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/playlist/${playlist.id}`)}
    >
      <div className={styles.playlistImageContainer}>
        <div className={styles.gameIconsGrid}>
          {playlist.gameIcons.slice(0, 4).map((icon, index) => (
            <div key={index} className={styles.gameIconWrapper}>
              <Image
                src={icon}
                alt={`Game ${index + 1}`}
                width={96}
                height={96}
                className={styles.gameIcon}
              />
            </div>
          ))}
        </div>
      </div>

      <Stack p="md" gap="xs">
        <Text size="lg" fw={600} lineClamp={2} className={styles.playlistTitle}>
          {playlist.title}
        </Text>

        {playlist.description?.trim() !== '' && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {playlist.description}
          </Text>
        )}

        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            @{playlist.username}
          </Text>

          <Group gap="xs" align="center">
            <IconHeart size={16} className={styles.heartIcon} />
            <Text size="sm" c="dimmed">
              {playlist.likes} likes
            </Text>
          </Group>
        </Group>

        {!playlist.isPublic && (
          <Badge size="sm" variant="light" color="gray">
            Private
          </Badge>
        )}

        {(playlist.createdAt?.trim() !== '' || playlist.updatedAt?.trim() !== '') && (
          <Group gap="xs" c="dimmed" style={{ fontSize: '12px' }}>
            {playlist.createdAt?.trim() !== '' && (
              <Text size="xs">Created: {new Date(playlist.createdAt as string).toLocaleDateString()}</Text>
            )}
            {playlist.updatedAt?.trim() !== '' && (
              <Text size="xs">Updated: {new Date(playlist.updatedAt as string).toLocaleDateString()}</Text>
            )}
          </Group>
        )}
      </Stack>
    </Card>
  )
}

export default function LoggedInPlaylistsComponent() {
  const isSm = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1200px)')
  const isXl = useMediaQuery('(min-width: 1600px)')
  const isXxl = useMediaQuery('(min-width: 2000px)')

  const span = isXxl ? 2 : isXl ? 3 : isLg ? 4 : isSm ? 6 : 12

  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('my-playlists')
  const itemsPerPage = 12

  // Filter and sort logic
  const filteredAndSortedPlaylists = useMemo(() => {
    let playlists = activeTab === 'my-playlists' ? myPlaylists : publicPlaylists

    // Apply search filter
    if (searchQuery.trim() !== '') {
      playlists = playlists.filter(playlist =>
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    const sorted = [...playlists].sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes
        case 'title':
          return a.title.localeCompare(b.title)
        case 'oldest':
          return a.id - b.id
        case 'newest':
        default:
          return b.id - a.id
      }
    })

    return sorted
  }, [activeTab, searchQuery, sortBy])

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
        >
          Create New Playlist
        </Button>
      </Group>

      <Tabs value={activeTab} onChange={handleTabChange} className={styles.playlistTabs}>
        <Tabs.List mb="md">
          <Tabs.Tab value="my-playlists" leftSection={<IconUsers size={16} />}>
            My Playlists ({myPlaylists.length})
          </Tabs.Tab>
          <Tabs.Tab value="public-playlists" leftSection={<IconHeart size={16} />}>
            Public Playlists ({publicPlaylists.length})
          </Tabs.Tab>
          <Tabs.Tab value="all-likes" leftSection={<IconHeart size={16} />}>
            Liked Playlists
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
            <Button
              variant="filled"
              color="blue"
              leftSection={<IconSearch size={16} />}
              className={styles.searchButton}
            >
              Search
            </Button>
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
            {filteredAndSortedPlaylists.length === myPlaylists.length
              ? `Showing all ${myPlaylists.length} playlists`
              : `Showing ${filteredAndSortedPlaylists.length} of ${myPlaylists.length} playlists`}
          </Text>

          <Grid gutter={8}>
            {currentPage === 1 && searchQuery.trim() === '' && (
              <Grid.Col span={span}>
                <PlaylistCard playlist={{} as any} showCreateCard={true} />
              </Grid.Col>
            )}
            {paginatedPlaylists.map((playlist) => (
              <Grid.Col key={playlist.id} span={span}>
                <PlaylistCard playlist={playlist} />
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
            {filteredAndSortedPlaylists.length === publicPlaylists.length
              ? `Showing all ${publicPlaylists.length} playlists`
              : `Showing ${filteredAndSortedPlaylists.length} of ${publicPlaylists.length} playlists`}
          </Text>

          <Grid gutter={8}>
            {paginatedPlaylists.map((playlist) => (
              <Grid.Col key={playlist.id} span={span}>
                <PlaylistCard playlist={playlist} />
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
          <Text ta="center" c="dimmed" mt="xl">
            Your liked playlists will appear here.
          </Text>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}
