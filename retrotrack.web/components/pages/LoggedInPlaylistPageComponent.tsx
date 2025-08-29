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
  Divider,
  Progress,
  Box,
  Checkbox,
  Tooltip,
  Paper,
  ActionIcon,
  Title,
  Badge,
  Flex,
  ScrollArea,
  Table,
  Select,
  TextInput,
  Avatar,
  Anchor,
  Modal,
  Loader,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconUsers,
  IconCheck,
  IconAward,
  IconHeart,
  IconArrowLeft,
  IconSearch,
  IconFilter,
  IconPlayerPlay,
  IconCrown,
  IconMedal,
  IconTargetArrow,
  IconEdit,
  IconTrash,
  IconShare,
  IconBookmark,
  IconPlus,
  IconPencil,
  IconDeviceFloppy,
  IconX,
} from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import pageStyles from '@/css/pages/gamePage.module.scss'
import playlistStyles from '@/css/pages/playlists.module.scss'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import PaginatedTable from '@/components/shared/PaginatedTable'
import type { SortOption } from '@/components/shared/PaginatedTable'
import { useGameModal } from '@/context/gameModalContext'

interface LoggedInPlaylistPageProps {
  playlistId: number
}

// Dummy playlist data - replace with actual API call
const playlistData = {
  id: 1,
  title: 'RPG Favorites',
  description: 'A curated collection of my favorite RPG games from different eras. These games represent the pinnacle of storytelling and character development in gaming.',
  username: 'CurrentUser',
  isOwner: true,
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

// Dummy games data with progress stats
const playlistGames = [
  {
    id: 1,
    playlistOrder: 1,
    title: 'Final Fantasy VI',
    consoleName: 'SNES',
    gameImage: '/Images/085573.png',
    totalAchievements: 85,
    unlockedAchievements: 72,
    pointsEarned: 1250,
    totalPoints: 1500,
    completionPercentage: 84.7,
    masteryBadge: 'https://media.retroachievements.org/Badge/12345.png',
    status: 'mastered', // 'not-started', 'in-progress', 'beaten-softcore', 'beaten-hardcore', 'completed', 'mastered'
    lastPlayed: '2024-08-20'
  },
  {
    id: 2,
    playlistOrder: 2,
    title: 'Chrono Trigger',
    consoleName: 'SNES',
    gameImage: '/Images/085574.png',
    totalAchievements: 92,
    unlockedAchievements: 88,
    pointsEarned: 1450,
    totalPoints: 1520,
    completionPercentage: 95.7,
    masteryBadge: 'https://media.retroachievements.org/Badge/12346.png',
    status: 'completed',
    lastPlayed: '2024-08-18'
  },
  {
    id: 3,
    playlistOrder: 3,
    title: 'Secret of Mana',
    consoleName: 'SNES',
    gameImage: '/Images/085575.png',
    totalAchievements: 67,
    unlockedAchievements: 45,
    pointsEarned: 890,
    totalPoints: 1200,
    completionPercentage: 67.2,
    masteryBadge: null,
    status: 'in-progress',
    lastPlayed: '2024-08-15'
  },
  {
    id: 4,
    playlistOrder: 4,
    title: 'Tales of Phantasia',
    consoleName: 'SNES',
    gameImage: '/Images/085576.png',
    totalAchievements: 78,
    unlockedAchievements: 78,
    pointsEarned: 1380,
    totalPoints: 1380,
    completionPercentage: 100,
    masteryBadge: 'https://media.retroachievements.org/Badge/12348.png',
    status: 'mastered',
    lastPlayed: '2024-08-10'
  },
  {
    id: 5,
    playlistOrder: 5,
    title: 'Terranigma',
    consoleName: 'SNES',
    gameImage: '/Images/085577.png',
    totalAchievements: 89,
    unlockedAchievements: 12,
    pointsEarned: 200,
    totalPoints: 1650,
    completionPercentage: 13.5,
    masteryBadge: null,
    status: 'in-progress',
    lastPlayed: '2024-07-28'
  },
  {
    id: 6,
    playlistOrder: 6,
    title: 'Phantasy Star IV',
    consoleName: 'Genesis',
    gameImage: '/Images/085578.png',
    totalAchievements: 76,
    unlockedAchievements: 0,
    pointsEarned: 0,
    totalPoints: 1420,
    completionPercentage: 0,
    masteryBadge: null,
    status: 'not-started',
    lastPlayed: null
  }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'mastered': return 'yellow'
    case 'completed': return 'blue'
    case 'beaten-hardcore': return 'red'
    case 'beaten-softcore': return 'orange'
    case 'in-progress': return 'green'
    case 'not-started': return 'gray'
    default: return 'gray'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'mastered': return <IconCrown size={16} />
    case 'completed': return <IconMedal size={16} />
    case 'beaten-hardcore': return <IconTargetArrow size={16} />
    case 'beaten-softcore': return <IconPlayerPlay size={16} />
    case 'in-progress': return <IconDeviceGamepad size={16} />
    case 'not-started': return null
    default: return null
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'mastered': return 'Mastered'
    case 'completed': return 'Completed'
    case 'beaten-hardcore': return 'Beaten (Hardcore)'
    case 'beaten-softcore': return 'Beaten (Softcore)'
    case 'in-progress': return 'In Progress'
    case 'not-started': return 'Not Started'
    default: return 'Unknown'
  }
}

export function LoggedInPlaylistPage(props: LoggedInPlaylistPageProps) {
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const gameModal = useGameModal()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [consoleFilter, setConsoleFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortOption, setSortOption] = useState<SortOption<typeof playlistGames[0]>>({
    key: 'playlistOrder',
    direction: 'asc'
  })
  
  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [tempPlaylistName, setTempPlaylistName] = useState(playlistData.title)
  const [tempGames, setTempGames] = useState(playlistGames)
  const [gamesToDelete, setGamesToDelete] = useState<number[]>([])

  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    if (editMode) {
      // Cancel edit mode - reset temp states
      setTempPlaylistName(playlistData.title)
      setTempGames(playlistGames)
      setGamesToDelete([])
      setEditingName(false)
    }
    setEditMode(!editMode)
  }

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      // Here you would make API calls to save changes
      // For now, we'll just show notifications
      
      if (tempPlaylistName !== playlistData.title) {
        notifications.show({
          title: 'Playlist Updated',
          message: `Playlist name changed to "${tempPlaylistName}"`,
          color: 'green',
        })
      }

      if (gamesToDelete.length > 0) {
        notifications.show({
          title: 'Games Removed',
          message: `${gamesToDelete.length} game(s) removed from playlist`,
          color: 'orange',
        })
      }

      const reorderedGames = tempGames.filter(g => !gamesToDelete.includes(g.id))
      if (JSON.stringify(reorderedGames.map(g => g.playlistOrder)) !== JSON.stringify(playlistGames.map(g => g.playlistOrder))) {
        notifications.show({
          title: 'Order Updated',
          message: 'Game order has been updated',
          color: 'blue',
        })
      }

      setEditMode(false)
      setEditingName(false)
      setGamesToDelete([])
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to save changes. Please try again.',
        color: 'red',
      })
    }
  }

  // Handle game order change
  const handleOrderChange = (gameId: number, newOrder: number) => {
    setTempGames(prev => prev.map(game => 
      game.id === gameId 
        ? { ...game, playlistOrder: newOrder }
        : game
    ))
  }

  // Handle game deletion
  const handleDeleteGame = (gameId: number) => {
    setGamesToDelete(prev => [...prev, gameId])
  }

  // Handle game restore
  const handleRestoreGame = (gameId: number) => {
    setGamesToDelete(prev => prev.filter(id => id !== gameId))
  }

  // Handle sorting
  const handleSortChange = (newSortOption: SortOption<typeof playlistGames[0]>) => {
    setSortOption(newSortOption)
    setPage(1) // Reset to first page when sorting changes
  }

  // Calculate stats
  const stats = useMemo(() => {
    const total = playlistGames.length
    const mastered = playlistGames.filter(g => g.status === 'mastered').length
    const completed = playlistGames.filter(g => g.status === 'completed').length
    const beatenHardcore = playlistGames.filter(g => g.status === 'beaten-hardcore').length
    const beatenSoftcore = playlistGames.filter(g => g.status === 'beaten-softcore').length
    const inProgress = playlistGames.filter(g => g.status === 'in-progress').length
    const notStarted = playlistGames.filter(g => g.status === 'not-started').length
    
    const totalPoints = playlistGames.reduce((sum, game) => sum + game.pointsEarned, 0)
    const maxPoints = playlistGames.reduce((sum, game) => sum + game.totalPoints, 0)
    const avgCompletion = playlistGames.reduce((sum, game) => sum + game.completionPercentage, 0) / total

    return {
      total,
      mastered,
      completed,
      beatenHardcore,
      beatenSoftcore,
      inProgress,
      notStarted,
      totalPoints,
      maxPoints,
      avgCompletion
    }
  }, [])

  // Filter and sort games
  const filteredGames = useMemo(() => {
    const gamesToShow = editMode ? tempGames : playlistGames
    let filtered = gamesToShow.filter(g => !gamesToDelete.includes(g.id))

    if (searchQuery) {
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.consoleName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(game => game.status === statusFilter)
    }

    if (consoleFilter !== 'all') {
      filtered = filtered.filter(game => game.consoleName === consoleFilter)
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      const key = sortOption.key
      let aValue = a[key]
      let bValue = b[key]

      // Handle special cases for sorting
      if (key === 'lastPlayed') {
        aValue = aValue ? new Date(aValue as string).getTime() : 0
        bValue = bValue ? new Date(bValue as string).getTime() : 0
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortOption.direction === 'asc' ? comparison : -comparison
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue
        return sortOption.direction === 'asc' ? comparison : -comparison
      }

      return 0
    })
  }, [searchQuery, statusFilter, consoleFilter, editMode, tempGames, gamesToDelete, sortOption])

  const uniqueConsoles = [...new Set(playlistGames.map(g => g.consoleName))].sort()

  // Table columns configuration
  const columns = [
    {
      title: '',
      key: 'gameImage' as keyof typeof playlistGames[0],
      render: (game: typeof playlistGames[0]) => (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minWidth: '64px',
          opacity: gamesToDelete.includes(game.id) ? 0.5 : 1
        }}>
          <Image
            src={`https://media.retroachievements.org${game.gameImage}`}
            alt={game.title}
            width={64}
            height={64}
            className={tableStyles.roundedImage}
            style={{
              filter: gamesToDelete.includes(game.id) ? 'grayscale(100%)' : 'none'
            }}
          />
        </div>
      )
    },
    {
      title: '#',
      key: 'playlistOrder' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <div style={{ textAlign: 'center', minWidth: '60px' }}>
          {editMode ? (
            <Select
              value={game.playlistOrder.toString()}
              onChange={(value) => handleOrderChange(game.id, parseInt(value || '1'))}
              data={Array.from({ length: tempGames.length }, (_, i) => ({
                value: (i + 1).toString(),
                label: (i + 1).toString()
              }))}
              size="xs"
              style={{ width: '60px' }}
            />
          ) : (
            <Text fw={600} size="sm" c="dimmed">
              {game.playlistOrder}
            </Text>
          )}
        </div>
      )
    },
    {
      title: 'Game',
      key: 'title' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Group gap="md" wrap="nowrap">
          <div style={{ 
            opacity: gamesToDelete.includes(game.id) ? 0.5 : 1,
            textDecoration: gamesToDelete.includes(game.id) ? 'line-through' : 'none'
          }}>
            <Text fw={500} c={gamesToDelete.includes(game.id) ? 'red' : undefined}>
              {game.title}
            </Text>
          </div>
        </Group>
      )
    },
    {
      title: 'Console',
      key: 'consoleName' as keyof typeof playlistGames[0],
      sortable: true
    },
    {
      title: 'Status',
      key: 'status' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Badge
          color={getStatusColor(game.status)}
          variant="light"
          leftSection={getStatusIcon(game.status)}
        >
          {getStatusLabel(game.status)}
        </Badge>
      )
    },
    {
      title: 'Progress',
      key: 'completionPercentage' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <div>
          <Progress
            value={game.completionPercentage}
            size="sm"
            mb="xs"
            color={getStatusColor(game.status)}
          />
          <Text size="xs" c="dimmed">
            {game.unlockedAchievements}/{game.totalAchievements} achievements ({game.completionPercentage.toFixed(1)}%)
          </Text>
        </div>
      )
    },
    {
      title: 'Points',
      key: 'pointsEarned' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <div>
          <Text size="sm" fw={500}>
            {game.pointsEarned.toLocaleString()}
          </Text>
          <Text size="xs" c="dimmed">
            /{game.totalPoints.toLocaleString()}
          </Text>
        </div>
      )
    },
    {
      title: 'Last Played',
      key: 'lastPlayed' as keyof typeof playlistGames[0],
      sortable: true,
      render: (game: typeof playlistGames[0]) => (
        <Text size="sm">
          {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Never'}
        </Text>
      )
    }
  ]

  // Add actions column for edit mode (remove/restore) or always show regular actions
  if (editMode && playlistData.isOwner) {
    columns.push({
      title: 'Remove',
      key: 'id' as keyof typeof playlistGames[0],
      render: (game: typeof playlistGames[0]) => (
        <Group gap="xs">
          {gamesToDelete.includes(game.id) ? (
            <ActionIcon
              variant="subtle"
              color="green"
              size="sm"
              onClick={() => handleRestoreGame(game.id)}
            >
              <IconCheck size={16} />
            </ActionIcon>
          ) : (
            <ActionIcon
              variant="subtle"
              color="red"
              size="sm"
              onClick={() => handleDeleteGame(game.id)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          )}
        </Group>
      )
    })
  }

  return (
    <Container size="100%" px="md" py="xl" className={pageStyles.pageContainer}>
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
              <div style={{ flex: 1 }}>
                {editingName ? (
                  <Group gap="xs" mb="xs">
                    <TextInput
                      value={tempPlaylistName}
                      onChange={(e) => setTempPlaylistName(e.currentTarget.value)}
                      size="xl"
                      style={{ flex: 1 }}
                      variant="unstyled"
                      styles={{
                        input: {
                          fontSize: '2rem',
                          fontWeight: 700,
                          padding: 0,
                          minHeight: 'auto',
                          height: 'auto'
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingName(false)
                        } else if (e.key === 'Escape') {
                          setTempPlaylistName(playlistData.title)
                          setEditingName(false)
                        }
                      }}
                      autoFocus
                    />
                    <ActionIcon
                      variant="subtle"
                      color="green"
                      onClick={() => setEditingName(false)}
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => {
                        setTempPlaylistName(playlistData.title)
                        setEditingName(false)
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Group>
                ) : (
                  <Group gap="xs" mb="xs" align="center">
                    <Title order={1} size="2rem">
                      {editMode ? tempPlaylistName : playlistData.title}
                    </Title>
                    {playlistData.isOwner && editMode && (
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => setEditingName(true)}
                        size="sm"
                      >
                        <IconPencil size={16} />
                      </ActionIcon>
                    )}
                  </Group>
                )}
                <Group gap="md" align="center" mb="sm">
                  <Avatar size="sm" />
                  <Text size="lg" c="dimmed">@{playlistData.username}</Text>
                  <Badge
                    color={playlistData.isPublic ? 'green' : 'gray'}
                    variant="light"
                  >
                    {playlistData.isPublic ? 'Public' : 'Private'}
                  </Badge>
                </Group>
              </div>

              {/* Action Buttons */}
              <Group gap="xs">
                {playlistData.isOwner && (
                  <>
                    {editMode ? (
                      <>
                        <Button
                          leftSection={<IconDeviceFloppy size={16} />}
                          variant="filled"
                          color="green"
                          onClick={handleSaveChanges}
                        >
                          Save Changes
                        </Button>
                        <Button
                          leftSection={<IconX size={16} />}
                          variant="outline"
                          color="red"
                          onClick={handleEditModeToggle}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <ActionIcon
                          variant="light"
                          color="blue"
                          size="lg"
                          onClick={handleEditModeToggle}
                        >
                          <IconEdit size={20} />
                        </ActionIcon>
                        <ActionIcon variant="light" color="red" size="lg">
                          <IconTrash size={20} />
                        </ActionIcon>
                      </>
                    )}
                  </>
                )}
                {!editMode && (
                  <>
                    <ActionIcon variant="light" color="gray" size="lg">
                      <IconShare size={20} />
                    </ActionIcon>
                    <Button
                      leftSection={<IconHeart size={16} />}
                      variant="light"
                      color="red"
                    >
                      {playlistData.likes} Likes
                    </Button>
                  </>
                )}
              </Group>
            </Group>

            {playlistData.description && (
              <Text size="md" c="dimmed" mb="md">
                {playlistData.description}
              </Text>
            )}

            <Group gap="lg">
              <Text size="sm" c="dimmed">
                <strong>{stats.total}</strong> games
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

      {/* Progress Stats */}
      <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Mastered</Text>
            <IconCrown size={16} color="gold" />
          </Group>
          <Text size="xl" fw={700}>{stats.mastered}</Text>
          <Text size="xs" c="dimmed">{((stats.mastered / stats.total) * 100).toFixed(1)}% of playlist</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Completed</Text>
            <IconMedal size={16} color="blue" />
          </Group>
          <Text size="xl" fw={700}>{stats.completed}</Text>
          <Text size="xs" c="dimmed">{((stats.completed / stats.total) * 100).toFixed(1)}% of playlist</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Total Points</Text>
            <IconTrophy size={16} color="orange" />
          </Group>
          <Text size="xl" fw={700}>{stats.totalPoints.toLocaleString()}</Text>
          <Text size="xs" c="dimmed">{stats.maxPoints.toLocaleString()} max</Text>
        </Card>

        <Card radius="md" p="md" className={playlistStyles.statCard}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed">Avg Completion</Text>
            <IconTargetArrow size={16} color="green" />
          </Group>
          <Text size="xl" fw={700}>{stats.avgCompletion.toFixed(1)}%</Text>
          <Progress value={stats.avgCompletion} size="xs" mt="xs" />
        </Card>
      </SimpleGrid>

      {/* Filters and Search */}
      <Card radius="md" p="md" mb="lg">
        <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
          <Group gap="md" style={{ flex: 1 }}>
            <Group gap="xs" style={{ minWidth: 200 }}>
              <TextInput
                placeholder="Search games..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Search functionality handled by onChange
                  }
                }}
              />
              <Button
                variant="light"
                color="blue"
                size="sm"
                leftSection={<IconSearch size={16} />}
              >
                Search
              </Button>
            </Group>
            
            <Select
              placeholder="Status"
              data={[
                { value: 'all', label: 'All Status' },
                { value: 'mastered', label: 'Mastered' },
                { value: 'completed', label: 'Completed' },
                { value: 'beaten-hardcore', label: 'Beaten (Hardcore)' },
                { value: 'beaten-softcore', label: 'Beaten (Softcore)' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'not-started', label: 'Not Started' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              leftSection={<IconFilter size={16} />}
              style={{ minWidth: 150 }}
            />

            <Select
              placeholder="Console"
              data={[
                { value: 'all', label: 'All Consoles' },
                ...uniqueConsoles.map(console => ({ value: console, label: console }))
              ]}
              value={consoleFilter}
              onChange={(value) => setConsoleFilter(value || 'all')}
              style={{ minWidth: 120 }}
            />
          </Group>

          <Group gap="xs">
            {editMode && (
              <Badge color="blue" variant="light" size="lg">
                Edit Mode
              </Badge>
            )}
            
            {playlistData.isOwner && !editMode && (
              <Button
                leftSection={<IconPlus size={16} />}
                variant="filled"
                color="blue"
              >
                Add Games
              </Button>
            )}
          </Group>
        </Group>
      </Card>

      {/* Games Table */}
      <PaginatedTable
        data={filteredGames}
        columns={columns}
        page={page}
        total={Math.ceil(filteredGames.length / pageSize)}
        onPageChange={setPage}
        onRowClick={editMode ? undefined : (game) => gameModal.showModal(game.id)}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => {
          setPageSize(newPageSize)
          setPage(1)
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        showPageSizeSelector={true}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        actions={editMode ? [] : [
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

      {editMode && gamesToDelete.length > 0 && (
        <Card radius="md" p="md" mt="md" style={{ backgroundColor: 'var(--mantine-color-red-0)' }}>
          <Group justify="space-between" align="center">
            <div>
              <Text size="sm" fw={500} c="red">
                {gamesToDelete.length} game(s) will be removed from the playlist
              </Text>
              <Text size="xs" c="dimmed">
                Changes will be applied when you save
              </Text>
            </div>
            <Button
              size="xs"
              variant="subtle"
              color="red"
              onClick={() => setGamesToDelete([])}
            >
              Restore All
            </Button>
          </Group>
        </Card>
      )}
    </Container>
  )
}
