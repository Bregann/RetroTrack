'use client'

import { Badge, Button, Card, Container, Grid, Group, Stack, Text, TextInput, Pagination, ActionIcon } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconHeart, IconSearch, IconX, IconLogin } from '@tabler/icons-react'
import { pressStart2P } from '@/font/pressStart2P'
import styles from '@/css/pages/playlists.module.scss'
import Image from 'next/image'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

// Dummy data for public playlists (expanded set)
const publicPlaylists = [
  {
    id: 4,
    title: 'Cozy RPG Evenings',
    username: 'Guinea',
    likes: 92,
    isPublic: true,
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
    gameIcons: [
      'https://media.retroachievements.org/Images/085581.png',
      'https://media.retroachievements.org/Images/085582.png',
      'https://media.retroachievements.org/Images/085583.png',
      'https://media.retroachievements.org/Images/085584.png'
    ]
  },
  {
    id: 7,
    title: 'Super Mario Speedruns',
    username: 'Guinea',
    likes: 30,
    isPublic: true,
    gameIcons: [
      'https://media.retroachievements.org/Images/085585.png',
      'https://media.retroachievements.org/Images/085586.png',
      'https://media.retroachievements.org/Images/085587.png'
    ]
  },
  {
    id: 8,
    title: 'Podcasts + Games',
    username: 'Guinea',
    likes: 23,
    isPublic: true,
    gameIcons: [
      'https://media.retroachievements.org/Images/085588.png',
      'https://media.retroachievements.org/Images/085589.png',
      'https://media.retroachievements.org/Images/085590.png',
      'https://media.retroachievements.org/Images/085591.png'
    ]
  },
  {
    id: 9,
    title: 'Beat Em Up Collection',
    username: 'RetroGamer',
    likes: 156,
    isPublic: true,
    gameIcons: [
      'https://media.retroachievements.org/Images/085592.png',
      'https://media.retroachievements.org/Images/085593.png',
      'https://media.retroachievements.org/Images/085594.png',
      'https://media.retroachievements.org/Images/085595.png'
    ]
  },
  {
    id: 10,
    title: 'Racing Games Galore',
    username: 'SpeedRacer',
    likes: 88,
    isPublic: true,
    gameIcons: [
      'https://media.retroachievements.org/Images/085596.png',
      'https://media.retroachievements.org/Images/085597.png',
      'https://media.retroachievements.org/Images/085598.png',
      'https://media.retroachievements.org/Images/085599.png'
    ]
  },
  {
    id: 11,
    title: 'Horror Night Sessions',
    username: 'ScreamQueen',
    likes: 134,
    isPublic: true,
    gameIcons: [
      'https://media.retroachievements.org/Images/085600.png',
      'https://media.retroachievements.org/Images/085601.png',
      'https://media.retroachievements.org/Images/085602.png',
      'https://media.retroachievements.org/Images/085603.png'
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
  }
}

function PlaylistCard({ playlist }: PlaylistCardProps) {
  const router = useRouter()

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
      </Stack>
    </Card>
  )
}

function LoginPromptCard() {
  return (
    <Card 
      className={styles.loginPromptCard}
      radius="md"
      p="lg"
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
        >
          Sign Up / Log In
        </Button>
      </Stack>
    </Card>
  )
}

export default function LoggedOutPlaylistsComponent() {
  const isSm = useMediaQuery('(min-width: 768px)')
  const isLg = useMediaQuery('(min-width: 1200px)')
  const isXl = useMediaQuery('(min-width: 1600px)')
  const isXxl = useMediaQuery('(min-width: 2000px)')
  
  const span = isXxl ? 2 : isXl ? 3 : isLg ? 4 : isSm ? 6 : 12
  
  // Search and pagination state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Filter and sort logic
  const filteredAndSortedPlaylists = useMemo(() => {
    let playlists = [...publicPlaylists]
    
    // Apply search filter
    if (searchQuery) {
      playlists = playlists.filter(playlist => 
        playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply sorting
    const sorted = playlists.sort((a, b) => {
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
  }, [searchQuery, sortBy])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedPlaylists.length / itemsPerPage)
  const paginatedPlaylists = filteredAndSortedPlaylists.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSortChange = (value: string | null) => {
    if (value) {
      setSortBy(value)
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
          Community Playlists
        </Text>
        
        <Button
          leftSection={<IconLogin size={16} />}
          variant="filled"
          color="blue"
          size="md"
          className={styles.createButton}
        >
          Sign Up to Create Playlists
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
      <Group mb="md" className={styles.searchContainer}>
        <Group style={{ flex: 1, maxWidth: 500 }} gap="xs">
          <TextInput
            placeholder="Search community playlists..."
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchQuery && (
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="gray"
                  onClick={() => handleSearchChange('')}
                >
                  <IconX size={14} />
                </ActionIcon>
              )
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

      {/* Results info */}
      <Text size="sm" c="dimmed" mb="md">
        {filteredAndSortedPlaylists.length === publicPlaylists.length 
          ? `Showing all ${publicPlaylists.length} community playlists`
          : `Showing ${filteredAndSortedPlaylists.length} of ${publicPlaylists.length} community playlists`}
      </Text>
      
      <Grid gutter={8}>
        {/* Show login prompt card on first page when no search */}
        {currentPage === 1 && !searchQuery && (
          <Grid.Col span={span}>
            <LoginPromptCard />
          </Grid.Col>
        )}
        {paginatedPlaylists.map((playlist) => (
          <Grid.Col key={playlist.id} span={span}>
            <PlaylistCard playlist={playlist} />
          </Grid.Col>
        ))}
      </Grid>

      {/* Pagination */}
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

      {/* No results message */}
      {filteredAndSortedPlaylists.length === 0 && (
        <Text ta="center" c="dimmed" mt="xl" size="lg">
          {searchQuery ? `No playlists found matching "${searchQuery}"` : 'No playlists found.'}
        </Text>
      )}
    </Container>
  )
}
