import { Modal, Group, Button, Text, Stack, Card, Image, Alert } from '@mantine/core'
import { useState, useEffect } from 'react'
import { IconCheck, IconList, IconAlertCircle } from '@tabler/icons-react'
import { closestCenter, DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { LoggedInGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'
import { useQueryClient } from '@tanstack/react-query'
import tableStyles from '@/css/components/publicGamesTable.module.scss'

interface ManageGameOrderModalProps {
  opened: boolean
  onClose: () => void
  games: LoggedInGameItem[]
  playlistId: string
}

interface ReorderRow {
  GameId: number
  NewIndex: number
}

interface ReorderPlaylistGamesRequest {
  PlaylistId: string
  ReorderData: ReorderRow[]
}

// Sortable item component for the modal
interface SortableGameItemProps {
  game: LoggedInGameItem
  index: number
}

function SortableGameItem({ game, index }: SortableGameItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: game.gameId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.8 : 1,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  }

  return (
    <Card
      key={game.gameId}
      p="sm"
      withBorder
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Group justify="space-between" align="center" wrap="nowrap" style={{ width: '100%', overflow: 'hidden' }}>
        <Group gap="md" style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <Text size="sm" fw={600} c="dimmed" style={{ minWidth: '24px', flexShrink: 0 }}>
            {index + 1}.
          </Text>
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
          <div style={{ minWidth: 0, overflow: 'hidden' }}>
            <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {game.title}
            </Text>
            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {game.consoleName}
            </Text>
          </div>
        </Group>
      </Group>
    </Card>
  )
}

export default function ManageGameOrderModal({
  opened,
  onClose,
  games,
  playlistId
}: ManageGameOrderModalProps) {
  const [orderModalGames, setOrderModalGames] = useState<LoggedInGameItem[]>(
    [...games].sort((a, b) => a.orderIndex - b.orderIndex)
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const reorderGamesMutation = useMutationApiData<ReorderPlaylistGamesRequest, null>({
    url: '/api/playlists/ReorderPlaylistGames',
    queryKey: [`PlaylistId=${playlistId}`],
    invalidateQuery: true,
    apiMethod: 'POST',
    onSuccess: () => {
      notificationHelper.showSuccessNotification(
        'Success',
        'Playlist game order updated successfully!',
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

      setErrorMessage(null)
      onClose()
    },
    onError: (error) => {
      const errorMsg = error.message !== null && error.message !== undefined && error.message.trim() !== ''
        ? error.message
        : 'Failed to reorder games. Please try again.'
      setErrorMessage(errorMsg)
    }
  })

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  // Handle drag end for reordering games
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      setOrderModalGames((items) => {
        const oldIndex = items.findIndex((g) => g.gameId === active.id)
        const newIndex = items.findIndex((g) => g.gameId === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)

        // Update order index based on new position
        return newItems.map((item, index) => ({
          ...item,
          orderIndex: index + 1,
        }))
      })
    }
  }

  // Handle order modal functions
  const saveOrderChanges = async () => {
    setErrorMessage(null)

    // Create the reorder data
    const reorderData: ReorderRow[] = orderModalGames.map((game, index) => ({
      GameId: game.gameId,
      NewIndex: index + 1
    }))

    const requestData: ReorderPlaylistGamesRequest = {
      PlaylistId: playlistId,
      ReorderData: reorderData
    }

    await reorderGamesMutation.mutateAsync(requestData)
  }

  const handleCancel = () => {
    setOrderModalGames([...games].sort((a, b) => a.orderIndex - b.orderIndex))
    setErrorMessage(null)
    onClose()
  }

  // Update modal games when games prop changes
  useEffect(() => {
    setOrderModalGames([...games].sort((a, b) => a.orderIndex - b.orderIndex))
  }, [games])

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      title={
        <Group gap="xs">
          <IconList size={20} />
          <Text fw={600}>Manage Game Order</Text>
        </Group>
      }
      size="lg"
      centered
      styles={{
        body: {
          overflowX: 'hidden',
          maxWidth: '100%'
        },
        content: {
          overflowX: 'hidden'
        }
      }}
    >
      <Stack gap="md" style={{ overflowX: 'hidden', width: '100%' }}>
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
          Drag and drop games to reorder them in your playlist.
        </Text>

        <div style={{ overflowX: 'hidden', width: '100%' }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={orderModalGames.map(g => g.gameId)} strategy={verticalListSortingStrategy}>
              <Stack gap="xs" style={{ overflowX: 'hidden', width: '100%' }}>
                {orderModalGames.map((game, index) => (
                  <SortableGameItem key={game.gameId} game={game} index={index} />
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
        </div>

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={reorderGamesMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="green"
            leftSection={<IconCheck size={16} />}
            onClick={saveOrderChanges}
            loading={reorderGamesMutation.isPending}
            disabled={reorderGamesMutation.isPending}
          >
            Save Order
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
