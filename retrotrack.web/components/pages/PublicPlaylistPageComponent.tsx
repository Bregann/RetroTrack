'use client'

import {
  Container,
  Group,
  Stack,
  Text,
  Card,
  Image,
  SimpleGrid,
  Button,
  Box,
  Title,
  Badge,
  Select,
  TextInput,
  Avatar,
  ActionIcon,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconTrophy,
  IconDeviceGamepad,
  IconHeart,
  IconArrowLeft,
  IconSearch,
  IconMedal,
  IconTargetArrow,
  IconLogin,
  IconBookmark,
} from '@tabler/icons-react'
import pageStyles from '@/css/pages/gamePage.module.scss'
import playlistStyles from '@/css/pages/playlists.module.scss'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'

interface PublicPlaylistPageProps {
  playlistId: number
  description?: string
}

// Dummy playlist data - replace with actual API call
const playlistData = {
  id: 1,
  title: 'RPG Favorites',
  description: 'A curated collection of my favorite RPG games from different eras. These games represent the pinnacle of storytelling and character development in gaming.',
  username: 'Guinea',
  isOwner: false,
  isPublic: true,
  likes: 45,
  gameCount: 12,
  createdAt: '2024-01-15',
  updatedAt: '2024-08-20',
  gameIcons: [
    'https://media.retroachievements.org/Images/085573.png',
    'https://media.retroachievements.org/Images/085574.png',
    'https://media.retroachievements.org/Images/085575.png',
    'https://media.retroachievements.org/Images/085576.png'
  ]
}

// Dummy games data (public view - no personal progress)
const playlistGames = [
  {
    id: 1,
    playlistOrder: 1,
    title: 'Final Fantasy VI',
    consoleName: 'SNES',
    gameImage: '/Images/085573.png',
    totalAchievements: 85,
    totalPoints: 1500,
    masteryBadge: 'https://media.retroachievements.org/Badge/12345.png',
    genre: 'JRPG',
    developer: 'Square',
    releaseYear: 1994
  },
  {
    id: 2,
    playlistOrder: 2,
    title: 'Chrono Trigger',
    consoleName: 'SNES',
    gameImage: '/Images/085574.png',
    totalAchievements: 92,
    totalPoints: 1520,
    masteryBadge: 'https://media.retroachievements.org/Badge/12346.png',
    genre: 'JRPG',
    developer: 'Square',
    releaseYear: 1995
  },
  {
    id: 3,
    playlistOrder: 3,
    title: 'Secret of Mana',
    consoleName: 'SNES',
    gameImage: '/Images/085575.png',
    totalAchievements: 67,
    totalPoints: 1200,
    masteryBadge: null,
    genre: 'Action RPG',
    developer: 'Square',
    releaseYear: 1993
  },
  {
    id: 4,
    playlistOrder: 4,
    title: 'Tales of Phantasia',
    consoleName: 'SNES',
    gameImage: '/Images/085576.png',
    totalAchievements: 78,
    totalPoints: 1380,
    masteryBadge: 'https://media.retroachievements.org/Badge/12348.png',
    genre: 'JRPG',
    developer: 'Namco',
    releaseYear: 1995
  },
  {
    id: 5,
    playlistOrder: 5,
    title: 'Terranigma',
    consoleName: 'SNES',
    gameImage: '/Images/085577.png',
    totalAchievements: 89,
    totalPoints: 1650,
    masteryBadge: null,
    genre: 'Action RPG',
    developer: 'Quintet',
    releaseYear: 1995
  },
  {
    id: 6,
    playlistOrder: 6,
    title: 'Phantasy Star IV',
    consoleName: 'Genesis',
    gameImage: '/Images/085578.png',
    totalAchievements: 76,
    totalPoints: 1420,
    masteryBadge: null,
    genre: 'JRPG',
    developer: 'Sega',
    releaseYear: 1993
  }
]

export function PublicPlaylistPage({ playlistId }: PublicPlaylistPageProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const gameModal = useGameModal()

  const [searchQuery, setSearchQuery] = useState('')
  const [consoleFilter, setConsoleFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortKey, setSortKey] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Calculate basic stats for public view
  const stats = useMemo(() => {
    const total = playlistGames.length
    const totalPoints = playlistGames.reduce((sum, game) => sum + game.totalPoints, 0)
    const totalAchievements = playlistGames.reduce((sum, game) => sum + game.totalAchievements, 0)
    const uniqueConsoles = [...new Set(playlistGames.map(g => g.consoleName))].length

    return {
      total,
      totalPoints,
      totalAchievements,
      uniqueConsoles
    }
  }, [])

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = playlistGames

    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.consoleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (consoleFilter !== 'all' && consoleFilter?.trim() !== '') {
      filtered = filtered.filter(game => game.consoleName === consoleFilter)
    }

    return filtered
  }, [searchQuery, consoleFilter])

  const uniqueConsoles = [...new Set(playlistGames.map(g => g.consoleName))].sort()

  // Handle sorting
  const handleSortChange = (option: { key: keyof typeof filteredGames[0]; direction: 'asc' | 'desc' }) => {
    setSortKey(option.key as string)
    setSortDirection(option.direction)
    setPage(1) // Reset to first page when sorting changes
  }

  // Table columns configuration
  const columns = [
    {
      title: '',
      key: 'gameImage' as keyof typeof playlistGames[0],
      render: (game: typeof playlistGames[0]) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '64px' }}>
          <Image
            src={`https://media.retroachievements.org${game.gameImage}`}
            alt={game.title}
            width={64}
            height={64}
            className={tableStyles.roundedImage}
          />
        </div>
      )
    },
    {
      title: '#',
      key: 'playlistOrder' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Text fw={600} size="sm" c="dimmed" style={{ textAlign: 'center', minWidth: '40px' }}>
          {game.playlistOrder}
        </Text>
      )
    },
    {
      title: 'Game Title',
      key: 'title' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Text fw={500}>{game.title}</Text>
      )
    },
    {
      title: 'Console',
      key: 'consoleName' as keyof typeof playlistGames[0],
      sortable: true
    },
    {
      title: 'Genre',
      key: 'genre' as keyof typeof playlistGames[0],
      render: (game: typeof playlistGames[0]) => (
        <Badge variant="light" color="gray" size="sm">
          {game.genre}
        </Badge>
      )
    },
    {
      title: 'Year',
      key: 'releaseYear' as keyof typeof playlistGames[0],
      sortable: true
    },
    {
      title: 'Achievements',
      key: 'totalAchievements' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Text fw={500}>{game.totalAchievements}</Text>
      )
    },
    {
      title: 'Points',
      key: 'totalPoints' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Text fw={500}>{game.totalPoints.toLocaleString()}</Text>
      )
    }
  ]

  return (
    <Container size="95%" px="md" py="xl" className={pageStyles.pageContainer}>
      {/* Header with back button */}
      <Group mb="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Group>

      {/* Login prompt banner for better experience */}
      <Card radius="md" p="md" mb="xl" className={playlistStyles.infoBanner}>
        <Group justify="space-between" align="center">
          <Group gap="md">
            <IconLogin size={24} className={playlistStyles.loginIcon} />
            <div>
              <Text fw={500} mb="xs">
                Sign in to track your progress on these games!
              </Text>
              <Text size="sm" c="dimmed">
                See your achievements, completion status, and personal stats for each game in this playlist.
              </Text>
            </div>
          </Group>
          <Button variant="filled" color="blue">
            Sign In
          </Button>
        </Group>
      </Card>

      {/* Playlist Header */}
      <Card radius="md" p="lg" mb="xl" className={playlistStyles.playlistHeaderCard}>
        <Group align="flex-start" wrap="nowrap" gap="lg">
          {/* Playlist Cover */}
          <Box className={playlistStyles.playlistCover}>
            <div className={playlistStyles.gameIconsGrid}>
              {playlistData.gameIcons.slice(0, 4).map((icon, index) => (
                <div key={index} className={playlistStyles.gameIconWrapper}>
                  <Image
                    src={icon}
                    alt={`Game ${index + 1}`}
                    width={80}
                    height={80}
                    className={playlistStyles.gameIcon}
                  />
                </div>
              ))}
            </div>
          </Box>

          {/* Playlist Info */}
          <Stack style={{ flex: 1 }} gap="sm">
            <Group justify="space-between" align="flex-start">
              <div>
                <Title order={1} size="2rem" mb="xs">
                  {playlistData.title}
                </Title>
                <Group gap="md" align="center" mb="sm">
                  <Avatar size="sm" />
                  <Text size="lg" c="dimmed">@{playlistData.username}</Text>
                  <Badge color="green" variant="light">
                    Public Playlist
                  </Badge>
                </Group>
              </div>

              {/* Action Buttons */}
              <Group gap="xs">
                <ActionIcon variant="light" color="gray" size="lg">
                  <IconBookmark size={20} />
                </ActionIcon>
                <Button
                  leftSection={<IconHeart size={16} />}
                  variant="light"
                  color="red"
                >
                  {playlistData.likes} Likes
                </Button>
              </Group>
            </Group>

            {playlistData.description?.trim() !== '' && (
              <Text size="md" c="dimmed" mb="md">
                {playlistData.description}
              </Text>
            )}

            <Group gap="lg">
              <Text size="sm" c="dimmed">
                <strong>{stats.total}</strong> games
              </Text>
              <Text size="sm" c="dimmed">
                <strong>{stats.uniqueConsoles}</strong> consoles
              </Text>
              <Text size="sm" c="dimmed">
                Created {new Date(playlistData.createdAt).toLocaleDateString()}
              </Text>
              <Text size="sm" c="dimmed">
                Updated {new Date(playlistData.updatedAt).toLocaleDateString()}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>

      {/* Basic Stats */}
      <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Games</Text>
            <IconDeviceGamepad size={16} />
          </Group>
          <Text size="xl" fw={700}>{stats.total}</Text>
          <Text size="xs" c="dimmed">In this playlist</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Points</Text>
            <IconTrophy size={16} color="orange" />
          </Group>
          <Text size="xl" fw={700}>{stats.totalPoints.toLocaleString()}</Text>
          <Text size="xs" c="dimmed">Available to earn</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Achievements</Text>
            <IconMedal size={16} color="blue" />
          </Group>
          <Text size="xl" fw={700}>{stats.totalAchievements}</Text>
          <Text size="xs" c="dimmed">Total available</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Consoles</Text>
            <IconTargetArrow size={16} color="green" />
          </Group>
          <Text size="xl" fw={700}>{stats.uniqueConsoles}</Text>
          <Text size="xs" c="dimmed">Different systems</Text>
        </Card>
      </SimpleGrid>

      {/* Search and Filters */}
      <Group mb="md" className={playlistStyles.searchContainer}>
        <Group style={{ flex: 1, maxWidth: 500 }} gap="xs">
          <TextInput
            placeholder="Search games..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            className={playlistStyles.searchInput}
            style={{ flex: 1 }}
          />
          <Button
            variant="filled"
            color="blue"
            leftSection={<IconSearch size={16} />}
            className={playlistStyles.searchButton}
          >
            Search
          </Button>
        </Group>

        <Select
          placeholder="All Consoles"
          data={[
            { value: 'all', label: 'All Consoles' },
            ...uniqueConsoles.map(console => ({ value: console, label: console }))
          ]}
          value={consoleFilter}
          onChange={(value) => setConsoleFilter(value?.trim() !== '' ? value as string : 'all')}
          style={{ minWidth: 140 }}
        />
      </Group>

      {/* Games Table */}
      <PaginatedTable
        data={filteredGames}
        columns={columns}
        page={page}
        total={Math.ceil(filteredGames.length / pageSize)}
        onPageChange={setPage}
        onRowClick={(game) => gameModal.showModal(game.id)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize)
          setPage(1)
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        showPageSizeSelector={true}
        sortOption={sortKey.trim() !== '' ? { key: sortKey as keyof typeof filteredGames[0], direction: sortDirection } : undefined}
        onSortChange={handleSortChange}
        actions={[
          {
            onClick: (game) => gameModal.showModal(game.id),
            label: 'Game Modal',
            variant: 'filled'
          },
          {
            onClick: (game) => router.push(`/game/${game.id}`),
            label: 'Game Page',
            variant: 'filled'
          }
        ]}
      />

      {/* Call to action for better experience */}
      <Group justify="space-between" align="center" mt="md" p="sm" style={{
        background: 'light-dark(#f8f9fa, rgba(255, 255, 255, 0.02))',
        borderRadius: 8,
        border: '1px solid light-dark(#e9ecef, rgba(255, 255, 255, 0.1))'
      }}>
        <Text size="sm" c="dimmed">
          Sign in to track your progress on these games
        </Text>
        <Group gap="xs">
          <Button variant="filled" color="blue" size="xs">
            Sign In
          </Button>
          <Button variant="outline" color="blue" size="xs">
            Create Account
          </Button>
        </Group>
      </Group>
    </Container>
  )
}
