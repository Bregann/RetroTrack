import { Modal, Group, Button, Alert, Text, Stack, Card, Image, ActionIcon, ScrollArea, Center, Loader } from '@mantine/core'
import { useState } from 'react'
import { IconAlertCircle, IconCheck, IconTrash } from '@tabler/icons-react'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import { useQueryClient } from '@tanstack/react-query'
import { LoggedInGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import tableStyles from '@/css/components/publicGamesTable.module.scss'

interface DeletePlaylistGamesModalProps {
  opened: boolean
  onClose: () => void
  playlistId: string
  games: LoggedInGameItem[]
  isLoading?: boolean
  queryKey: string
  onResetTable: () => void
}

interface RemoveGamesFromPlaylistData {
  PlaylistId: string
  GameIds: number[]
}

export default function DeletePlaylistGamesModal({
  opened,
  onClose,
  playlistId,
  games,
  isLoading = false,
  queryKey,
  onResetTable
}: DeletePlaylistGamesModalProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gamesToDelete, setGamesToDelete] = useState<number[]>([])
  const queryClient = useQueryClient()

  const removeGamesMutation = useMutationApiData<RemoveGamesFromPlaylistData, null>({
    url: '/api/playlists/RemoveGamesFromPlaylist',
    queryKey: [queryKey],
    invalidateQuery: true,
    apiMethod: 'DELETE',
    onSuccess: () => {
      const gameCount = gamesToDelete.length
      notificationHelper.showSuccessNotification(
        'Success',
        `${gameCount} game${gameCount === 1 ? '' : 's'} removed from playlist successfully!`,
        3000,
        <IconCheck />
      )

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

      setGamesToDelete([])
      setErrorMessage(null)
      onResetTable()
      onClose()
    },
    onError: (error) => {
      const errorMsg = error.message !== null && error.message !== undefined && error.message.trim() !== ''
        ? error.message
        : 'Failed to remove games from playlist. Please try again.'
      setErrorMessage(errorMsg)
    }
  })

  const handleDeleteGame = (gameId: number) => {
    setGamesToDelete(prev => [...prev, gameId])
  }

  const handleRestoreGame = (gameId: number) => {
    setGamesToDelete(prev => prev.filter(id => id !== gameId))
  }

  const handleRemoveGames = async () => {
    if (gamesToDelete.length === 0) return

    setErrorMessage(null)

    const removeData: RemoveGamesFromPlaylistData = {
      PlaylistId: playlistId,
      GameIds: gamesToDelete
    }

    await removeGamesMutation.mutateAsync(removeData)
  }

  const handleClose = () => {
    setGamesToDelete([])
    setErrorMessage(null)
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconTrash size={20} />
          <Text fw={600}>Delete Games from Playlist</Text>
        </Group>
      }
      size="lg"
    >
      <Stack gap="md">
        {(errorMessage !== null && errorMessage !== '') && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Error"
            color="red"
            variant="light"
          >
            {errorMessage}
          </Alert>
        )}

        <Text size="sm" c="dimmed">
          Click the trash icon next to games you want to remove from this playlist. You can restore games before confirming the deletion.
        </Text>

        {isLoading ? (
          <Center py="xl">
            <Loader size="md" />
          </Center>
        ) : (
          <div style={{ height: '400px', overflow: 'hidden' }}>
            <ScrollArea h="100%" type="scroll" offsetScrollbars scrollbarSize={8}>
              <Stack gap="xs">
              {games.length === 0 ? (
                <Center py="xl">
                  <Text c="dimmed">No games in this playlist</Text>
                </Center>
              ) : (
                [...games].sort((a, b) => a.orderIndex - b.orderIndex).map((game) => {
                  const isMarkedForDeletion = gamesToDelete.includes(game.gameId)
                  return (
                    <Card
                      key={game.gameId}
                      p="xs"
                      withBorder
                      style={{
                        opacity: isMarkedForDeletion ? 0.6 : 1,
                        textDecoration: isMarkedForDeletion ? 'line-through' : 'none',
                        backgroundColor: isMarkedForDeletion ? 'rgba(255, 0, 0, 0.1)' : undefined
                      }}
                    >
                      <Group gap="sm" wrap="nowrap">
                        <div style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minWidth: '64px',
                          flexShrink: 0
                        }}>
                          <Image
                            src={`https://media.retroachievements.org${game.gameIconUrl}`}
                            alt={game.title}
                            width={64}
                            height={64}
                            className={tableStyles.roundedImage}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text size="sm" fw={500} lineClamp={1}>
                            {game.title}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {game.consoleName}
                          </Text>
                        </div>
                        <ActionIcon
                          color={isMarkedForDeletion ? 'blue' : 'red'}
                          variant="light"
                          onClick={() => isMarkedForDeletion ? handleRestoreGame(game.gameId) : handleDeleteGame(game.gameId)}
                          disabled={removeGamesMutation.isPending}
                        >
                          {isMarkedForDeletion ? <IconCheck size={16} /> : <IconTrash size={16} />}
                        </ActionIcon>
                      </Group>
                    </Card>
                  )
                })
              )}
            </Stack>
          </ScrollArea>
          </div>
        )}

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            {gamesToDelete.length > 0 && `${gamesToDelete.length} game${gamesToDelete.length === 1 ? '' : 's'} marked for deletion`}
          </Text>
          <Group gap="sm">
            <Button
              variant="default"
              onClick={handleClose}
              disabled={removeGamesMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleRemoveGames}
              disabled={gamesToDelete.length === 0 || removeGamesMutation.isPending}
              loading={removeGamesMutation.isPending}
            >
              Delete {gamesToDelete.length > 0 ? `${gamesToDelete.length} ` : ''}Game{gamesToDelete.length === 1 ? '' : 's'}
            </Button>
          </Group>
        </Group>
      </Stack>
    </Modal>
  )
}
