import { Modal, Group, Button, Text, Stack, Card, Image, TextInput, Center, Loader } from '@mantine/core'
import { useState } from 'react'
import { IconPlus, IconSearch, IconTrophy, IconMedal, IconCheck } from '@tabler/icons-react'
import tableStyles from '@/css/components/publicGamesTable.module.scss'
import { SearchGamesResponse, PlaylistSearchGameResult } from '@/interfaces/api/playlists/SearchGamesResponse'
import { AddMultipleGamesToPlaylistRequest } from '@/interfaces/api/playlists/AddMultipleGamesToPlaylistRequest'
import { doGet, doPost } from '@/helpers/apiClient'
import { useQueryClient } from '@tanstack/react-query'
import notificationHelper from '@/helpers/notificationHelper'

interface AddGamesToPlaylistModalProps {
  opened: boolean
  onClose: () => void
  playlistId: string
  queryKey?: string
  onResetTable?: () => void
}

export default function AddGamesToPlaylistModal({
  opened,
  onClose,
  playlistId,
  queryKey,
  onResetTable
}: AddGamesToPlaylistModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<PlaylistSearchGameResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedGames, setSelectedGames] = useState<number[]>([])
  const queryClient = useQueryClient()

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return

    setIsSearching(true)
    try {
      const response = await doGet<SearchGamesResponse>(`/api/playlists/SearchGames/${encodeURIComponent(searchTerm)}/${encodeURIComponent(playlistId)}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      setSearchResults(response.data?.results ?? [])
    } catch (error) {
      console.error('Search failed:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleGameToggle = (gameId: number) => {
    setSelectedGames(prev =>
      prev.includes(gameId)
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    )
  }

  const handleAddGames = async () => {
    if (selectedGames.length === 0) return

    try {
      const requestData: AddMultipleGamesToPlaylistRequest = {
        playlistId: playlistId,
        gameIds: selectedGames
      }

      const response = await doPost('/api/playlists/AddMultipleGamesToPlaylist', {
        body: requestData
      })

      if (!response.ok) {
        throw new Error('Failed to add games to playlist')
      }

      // Show success notification
      const gameCount = selectedGames.length
      notificationHelper.showSuccessNotification(
        'Success',
        `${gameCount} game${gameCount === 1 ? '' : 's'} added to playlist successfully!`,
        3000,
        <IconCheck />
      )

      // Invalidate queries to refresh data
      if (queryKey != null && queryKey !== '') {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
      }
      queryClient.invalidateQueries({ queryKey: ['getUserPlaylists'] })
      queryClient.invalidateQueries({ queryKey: ['getPublicPlaylists'] })

      // Invalidate all queries containing this playlist ID
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey
          return queryKey.some(key =>
            typeof key === 'string' && key.includes(`PlaylistId=${playlistId}`)
          )
        }
      })

      // Invalidate all queries with SortByIndex
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey
          return queryKey.some(key =>
            typeof key === 'string' && key.includes('SortByIndex')
          )
        }
      })

      // Reset state, reset table, and close modal
      setSelectedGames([])
      setSearchResults([])
      setSearchTerm('')
      if (onResetTable != null) {
        onResetTable()
      }
      onClose()
    } catch (error) {
      console.error('Failed to add games:', error)
    }
  }

  const handleClose = () => {
    setSelectedGames([])
    setSearchResults([])
    setSearchTerm('')
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconPlus size={20} />
          <Text fw={600}>Add Games to Playlist</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Search for games to add to your playlist.
        </Text>

        {/* Search Input */}
        <Group gap="xs">
          <TextInput
            placeholder="Search for games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
          />
          <Button
            variant="filled"
            color="blue"
            onClick={handleSearch}
            disabled={searchTerm.trim() === '' || isSearching}
            loading={isSearching}
          >
            Search
          </Button>
        </Group>

        {/* Search Results */}
        {isSearching ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : searchResults.length > 0 ? (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <Stack gap="xs">
              {searchResults.map((game) => {
                const isSelected = selectedGames.includes(game.gameId)
                return (
                  <Card
                    key={game.gameId}
                    p="sm"
                    withBorder
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(0, 123, 255, 0.1)' : undefined,
                      borderColor: isSelected ? 'var(--mantine-color-blue-4)' : undefined
                    }}
                    onClick={() => handleGameToggle(game.gameId)}
                  >
                    <Group gap="md" wrap="nowrap">
                      <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minWidth: '64px',
                        flexShrink: 0
                      }}>
                        <Image
                          src={`https://media.retroachievements.org${game.gameImage}`}
                          alt={game.title}
                          width={64}
                          height={64}
                          className={tableStyles.roundedImage}
                        />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text size="sm" fw={500} lineClamp={1}>
                          {game.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {game.consoleName}
                        </Text>
                      </div>

                      <Group gap="lg" style={{ flexShrink: 0 }}>
                        <Group gap="xs">
                          <IconMedal size={16} color="blue" />
                          <Text size="sm">{game.achievementCount}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconTrophy size={16} color="orange" />
                          <Text size="sm">{game.points}</Text>
                        </Group>
                      </Group>
                    </Group>
                  </Card>
                )
              })}
            </Stack>
          </div>
        ) : searchTerm !== '' && !isSearching ? (
          <Center py="xl">
            <Text c="dimmed">No games found. Try a different search term.</Text>
          </Center>
        ) : null}

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            color="gray"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="green"
            leftSection={<IconPlus size={16} />}
            onClick={handleAddGames}
            disabled={selectedGames.length === 0}
          >
            Add {selectedGames.length > 0 ? `${selectedGames.length} ` : ''}Game{selectedGames.length === 1 ? '' : 's'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
