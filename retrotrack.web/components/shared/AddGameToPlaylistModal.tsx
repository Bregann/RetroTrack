'use client'

import {
  Modal,
  Group,
  Stack,
  Text,
  Card,
  Image,
  Button,
  Divider,
  TextInput,
  NumberInput,
  Select,
  Checkbox,
  ScrollArea,
  Badge,
  ActionIcon,
  Tooltip,
  Alert,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  IconPlus,
  IconSearch,
  IconGripVertical,
  IconTrash,
  IconInfoCircle,
  IconPlaylist,
  IconX,
  IconTrophy,
} from '@tabler/icons-react'
import { useState, useMemo } from 'react'
import styles from '@/css/components/gameModal.module.scss'

interface Game {
  id: number
  title: string
  consoleName: string
  gameImage: string
  totalAchievements: number
  totalPoints: number
  genre?: string
  releaseYear?: number
}

interface Playlist {
  id: number
  title: string
  description?: string
  gameCount: number
  isOwner: boolean
}

interface AddGameToPlaylistModalProps {
  opened: boolean
  onClose: () => void
  game?: Game
  userPlaylists: Playlist[]
  onAddToPlaylist: (playlistId: number, position?: number) => void
}

// Mock game data for search
const mockGames: Game[] = [
  {
    id: 1,
    title: 'Final Fantasy VI',
    consoleName: 'SNES',
    gameImage: '/Images/085573.png',
    totalAchievements: 85,
    totalPoints: 1500,
    genre: 'JRPG',
    releaseYear: 1994
  },
  {
    id: 2,
    title: 'Chrono Trigger',
    consoleName: 'SNES',
    gameImage: '/Images/085574.png',
    totalAchievements: 92,
    totalPoints: 1520,
    genre: 'JRPG',
    releaseYear: 1995
  },
  {
    id: 3,
    title: 'Secret of Mana',
    consoleName: 'SNES',
    gameImage: '/Images/085575.png',
    totalAchievements: 67,
    totalPoints: 1200,
    genre: 'Action RPG',
    releaseYear: 1993
  },
  {
    id: 4,
    title: 'Super Metroid',
    consoleName: 'SNES',
    gameImage: '/Images/085580.png',
    totalAchievements: 72,
    totalPoints: 1350,
    genre: 'Metroidvania',
    releaseYear: 1994
  },
  {
    id: 5,
    title: 'The Legend of Zelda: A Link to the Past',
    consoleName: 'SNES',
    gameImage: '/Images/085581.png',
    totalAchievements: 68,
    totalPoints: 1280,
    genre: 'Action Adventure',
    releaseYear: 1991
  }
]

export function AddGameToPlaylistModal({
  opened,
  onClose,
  game,
  userPlaylists,
  onAddToPlaylist
}: AddGameToPlaylistModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // State for adding mode vs search mode
  const [mode, setMode] = useState<'add-specific' | 'search-and-add'>('add-specific')
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null)
  const [position, setPosition] = useState<number | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGameForAdd, setSelectedGameForAdd] = useState<Game | undefined>(game)

  // Filter games based on search
  const filteredGames = useMemo(() => {
    if (!searchQuery) return mockGames
    return mockGames.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.consoleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const selectedPlaylistData = userPlaylists.find(p => p.id === selectedPlaylist)

  const handleAddGame = () => {
    if (!selectedPlaylist || !selectedGameForAdd) return
    
    onAddToPlaylist(selectedPlaylist, position)
    
    // Reset form
    setSelectedPlaylist(null)
    setPosition(undefined)
    setSelectedGameForAdd(undefined)
    setSearchQuery('')
    onClose()
  }

  const handleGameSelect = (gameToAdd: Game) => {
    setSelectedGameForAdd(gameToAdd)
    setMode('add-specific')
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="sm">
          <IconPlaylist size={20} />
          <Text fw={600}>Add Game to Playlist</Text>
        </Group>
      }
      size={isMobile ? 'full' : 'lg'}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        {/* Mode Selection */}
        <Group gap="sm">
          <Button
            variant={mode === 'add-specific' ? 'filled' : 'light'}
            size="xs"
            onClick={() => setMode('add-specific')}
            disabled={!game && !selectedGameForAdd}
          >
            Add Specific Game
          </Button>
          <Button
            variant={mode === 'search-and-add' ? 'filled' : 'light'}
            size="xs"
            onClick={() => setMode('search-and-add')}
          >
            Search & Add
          </Button>
        </Group>

        {mode === 'search-and-add' && (
          <>
            {/* Game Search */}
            <Card p="md" withBorder>
              <Stack gap="md">
                <Group justify="space-between" align="center">
                  <Text fw={500} size="sm">Search for Games</Text>
                  <Badge variant="light" size="sm">{filteredGames.length} found</Badge>
                </Group>
                
                <TextInput
                  placeholder="Search by title, console, or genre..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />

                <ScrollArea h={200} offsetScrollbars>
                  <Stack gap="xs">
                    {filteredGames.map((searchGame) => (
                      <Card
                        key={searchGame.id}
                        p="sm"
                        withBorder
                        style={{
                          cursor: 'pointer',
                          borderColor: selectedGameForAdd?.id === searchGame.id ? 'var(--mantine-color-blue-5)' : undefined
                        }}
                        onClick={() => handleGameSelect(searchGame)}
                      >
                        <Group gap="md" wrap="nowrap">
                          <Image
                            src={`https://media.retroachievements.org${searchGame.gameImage}`}
                            alt={searchGame.title}
                            width={40}
                            height={40}
                            radius="sm"
                          />
                          <div style={{ flex: 1 }}>
                            <Text fw={500} size="sm" lineClamp={1}>{searchGame.title}</Text>
                            <Group gap="xs">
                              <Badge variant="light" size="xs">{searchGame.consoleName}</Badge>
                              {searchGame.genre && (
                                <Badge variant="outline" size="xs" color="gray">{searchGame.genre}</Badge>
                              )}
                            </Group>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <Text size="xs" c="dimmed">{searchGame.totalAchievements} achievements</Text>
                            <Text size="xs" c="dimmed">{searchGame.totalPoints} points</Text>
                          </div>
                        </Group>
                      </Card>
                    ))}
                  </Stack>
                </ScrollArea>
              </Stack>
            </Card>
          </>
        )}

        {/* Selected Game Display */}
        {selectedGameForAdd && (
          <Card p="md" withBorder>
            <Group gap="md" wrap="nowrap">
              <Image
                src={`https://media.retroachievements.org${selectedGameForAdd.gameImage}`}
                alt={selectedGameForAdd.title}
                width={64}
                height={64}
                radius="md"
              />
              <div style={{ flex: 1 }}>
                <Text fw={600}>{selectedGameForAdd.title}</Text>
                <Group gap="xs" mt="xs">
                  <Badge variant="filled" size="sm">{selectedGameForAdd.consoleName}</Badge>
                  {selectedGameForAdd.genre && (
                    <Badge variant="light" size="sm" color="gray">{selectedGameForAdd.genre}</Badge>
                  )}
                  {selectedGameForAdd.releaseYear && (
                    <Badge variant="outline" size="sm" color="gray">{selectedGameForAdd.releaseYear}</Badge>
                  )}
                </Group>
                <Group gap="md" mt="xs">
                  <Text size="sm" c="dimmed">
                    <IconTrophy size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    {selectedGameForAdd.totalAchievements} achievements
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedGameForAdd.totalPoints} points
                  </Text>
                </Group>
              </div>
              {mode === 'search-and-add' && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={() => setSelectedGameForAdd(undefined)}
                >
                  <IconX size={16} />
                </ActionIcon>
              )}
            </Group>
          </Card>
        )}

        <Divider />

        {/* Playlist Selection */}
        <Stack gap="md">
          <Text fw={500} size="sm">Select Playlist</Text>
          
          {userPlaylists.length === 0 ? (
            <Alert color="blue" icon={<IconInfoCircle size={16} />}>
              You don't have any playlists yet. Create a playlist first to add games to it.
            </Alert>
          ) : (
            <Select
              placeholder="Choose a playlist..."
              data={userPlaylists.map(playlist => ({
                value: playlist.id.toString(),
                label: `${playlist.title} (${playlist.gameCount} games)`
              }))}
              value={selectedPlaylist?.toString() || null}
              onChange={(value) => setSelectedPlaylist(value ? parseInt(value) : null)}
            />
          )}

          {/* Position Selection */}
          {selectedPlaylistData && (
            <Stack gap="sm">
              <Group justify="space-between" align="center">
                <Text fw={500} size="sm">Position in Playlist</Text>
                <Tooltip label="Leave empty to add at the end">
                  <IconInfoCircle size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                </Tooltip>
              </Group>
              
              <NumberInput
                placeholder={`Position (1-${selectedPlaylistData.gameCount + 1})`}
                min={1}
                max={selectedPlaylistData.gameCount + 1}
                value={position}
                onChange={(value) => setPosition(typeof value === 'number' ? value : undefined)}
                description={`Current playlist has ${selectedPlaylistData.gameCount} games. Leave empty to add at the end.`}
              />
            </Stack>
          )}
        </Stack>

        <Divider />

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="filled"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddGame}
            disabled={!selectedGameForAdd || !selectedPlaylist}
          >
            Add to Playlist
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default AddGameToPlaylistModal
