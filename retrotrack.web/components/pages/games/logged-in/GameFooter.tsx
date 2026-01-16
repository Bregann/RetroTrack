import { Paper, Group, Tooltip, ActionIcon, Button, Select, Checkbox } from '@mantine/core'
import { IconRefresh, IconPlus, IconCheck, IconInfoCircle } from '@tabler/icons-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import { AddGameToPlaylistRequest } from '@/interfaces/api/playlists/AddGameToPlaylistRequest'
import notificationHelper from '@/helpers/notificationHelper'
import { useState } from 'react'
import styles from '@/css/components/gameModal.module.scss'

interface GameFooterProps {
  gameId: number
  disabled: boolean
  autoUpdateChecked: boolean
  onAutoUpdateChange: (_checked: boolean) => void
  onUpdateGame: () => Promise<void>
}

export function GameFooter({ gameId, disabled, autoUpdateChecked, onAutoUpdateChange, onUpdateGame }: GameFooterProps) {
  const queryClient = useQueryClient()
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)

  const { data } = useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
  })

  const { mutateAsync: trackedGameMutation } = useMutationApiData({
    url: data?.gameTracked === true ? `/api/trackedgames/DeleteTrackedGame/${gameId}` : `/api/trackedgames/AddTrackedGame/${gameId}`,
    invalidateQuery: false,
    queryKey: ['getGameInfoForUser', gameId],
    apiMethod: data?.gameTracked === true ? 'DELETE' : 'POST',
    onSuccess: async () => {
      queryClient.setQueryData(['getGameInfoForUser', gameId], (oldData: GetLoggedInSpecificGameInfoResponse | undefined) => {
        if (oldData === undefined) return oldData
        return {
          ...oldData,
          gameTracked: !oldData.gameTracked
        }
      })

      queryClient.invalidateQueries({ queryKey: ['getTrackedGames'] })
      notificationHelper.showSuccessNotification('Success', data?.gameTracked === true ? 'Game untracked.' : 'Game tracked.', 3000, <IconCheck size={16} />)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to update tracked game.', 3000, <IconInfoCircle size={16} />)
    }
  })

  const { mutateAsync: addToPlaylistMutation } = useMutationApiData<AddGameToPlaylistRequest, null>({
    url: '/api/playlists/AddGameToPlaylist',
    invalidateQuery: true,
    queryKey: ['getGameInfoForUser', gameId],
    apiMethod: 'POST',
    onSuccess: async () => {
      notificationHelper.showSuccessNotification('Success', 'Game added to playlist successfully!', 3000, <IconCheck size={16} />)
      setSelectedPlaylistId(null)
    },
    onError: () => {
      notificationHelper.showErrorNotification('Error', 'Failed to add game to playlist.', 3000, <IconInfoCircle size={16} />)
    }
  })

  const playlistOptions = (data?.playlists ?? []).map(playlist => ({
    value: playlist.id,
    label: playlist.name
  }))

  const handleAddToPlaylist = async () => {
    if (selectedPlaylistId === null || selectedPlaylistId === undefined || selectedPlaylistId.trim() === '') {
      notificationHelper.showErrorNotification('Error', 'Please select a playlist first.', 3000, <IconInfoCircle size={16} />)
      return
    }

    const requestData: AddGameToPlaylistRequest = {
      gameId: gameId,
      playlistId: selectedPlaylistId
    }

    await addToPlaylistMutation(requestData)
  }

  if (!data) return null

  return (
    <Paper className={styles.footer}>
      <Group justify="space-between" gap="xs" wrap="nowrap">
        {/* Left side - Update button and Track Game */}
        <Group gap="xs">
          <Tooltip label="Update game">
            <ActionIcon
              size="lg"
              onClick={onUpdateGame}
              disabled={disabled}
              visibleFrom="sm"
              color="green"
            >
              <IconRefresh />
            </ActionIcon>
          </Tooltip>
          <Button
            onClick={async () => { await trackedGameMutation({}) }}
            color={data.gameTracked ? 'red' : 'blue'}
          >
            {data.gameTracked ? 'Untrack Game' : 'Track Game'}
          </Button>
        </Group>

        {/* Center - Playlist Controls (only show if user has playlists) */}
        {playlistOptions.length > 0 && (
          <Group gap="xs" style={{ flex: 1, justifyContent: 'center' }}>
            <Select
              placeholder="Select a playlist"
              data={playlistOptions}
              value={selectedPlaylistId}
              onChange={setSelectedPlaylistId}
              style={{ minWidth: 180 }}
              clearable
              size="sm"
            />
            <Button
              leftSection={<IconPlus size={14} />}
              onClick={handleAddToPlaylist}
              disabled={selectedPlaylistId === null || selectedPlaylistId === undefined || selectedPlaylistId.trim() === ''}
              color="green"
              variant="light"
              size="sm"
            >
              Add to Playlist
            </Button>
          </Group>
        )}

        {/* Right side - External links and Auto Update */}
        <Group gap="xs">
          <Button
            component="a"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan' }}
            target="_blank"
            style={{ ':hover': { color: 'white' } }}
            href={'https://retroachievements.org/game/' + data.gameId}
            size="sm"
          >
            RA Page
          </Button>
          <Checkbox
            label="Auto Update Achievements"
            checked={autoUpdateChecked}
            onChange={(e) => onAutoUpdateChange(e.currentTarget.checked)}
          />
        </Group>
      </Group>
    </Paper>
  )
}
