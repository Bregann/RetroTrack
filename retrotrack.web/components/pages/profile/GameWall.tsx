'use client'

import { Box, Button, Divider, SimpleGrid, Text, Tooltip } from '@mantine/core'
import Image from 'next/image'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import styles from '@/css/pages/profile.module.scss'
import { GamesWall } from '@/interfaces/api/users/GetUserProfileResponse'
import { SortableGameWallIcon } from './SortableGameWallIcon'

interface GameWallProps {
  label: string
  /** The saved wall, shown when not editing */
  games: GamesWall[]
  /** The in-progress reorder; null means view mode */
  draft: GamesWall[] | null
  columns: number
  /** Whether to offer the Edit button at all */
  canEdit: boolean
  isSaving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onReorder: (_event: DragEndEvent) => void
  onGameClick: (_gameId: number) => void
}

/**
 * One wall of game icons, either read-only with tooltips or drag-reorderable.
 *
 * The beaten and mastered walls were previously ~80 lines of identical markup
 * each, differing only in which piece of state they read.
 */
export function GameWall({
  label,
  games,
  draft,
  columns,
  canEdit,
  isSaving,
  onEdit,
  onCancel,
  onSave,
  onReorder,
  onGameClick
}: GameWallProps) {
  const sensors = useSensors(useSensor(PointerSensor))
  const isEditing = draft !== null

  return (
    <>
      <Divider
        label={label}
        labelPosition="center"
        mb="md"
        classNames={{ label: styles.dividerText }}
      />

      {canEdit && (
        <div style={{ marginBottom: 10 }}>
          <Button
            disabled={isSaving}
            color={isEditing ? 'red' : 'blue'}
            onClick={isEditing ? onCancel : onEdit}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button disabled={isSaving} onClick={onSave} color="green" ml="md">
              Save Changes
            </Button>
          )}
        </div>
      )}

      {isEditing ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onReorder}
        >
          <SortableContext items={draft.map((g) => g.gameId)} strategy={rectSortingStrategy}>
            <SimpleGrid cols={columns} spacing="sm">
              {draft.map((game) => (
                <SortableGameWallIcon
                  key={game.gameId}
                  id={game.gameId}
                  icon={game.imageUrl}
                  title={game.title}
                  isHardcore={game.isHardcore}
                />
              ))}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      ) : (
        <SimpleGrid cols={columns} mb="sm">
          {games.map((game) => (
            <Tooltip
              key={game.gameId}
              label={
                <>
                  <Text ta="center">{game.title}</Text>
                  <Text ta="center" size="sm">{game.consoleName}</Text>
                  <Text ta="center" size="sm">
                    Earned: {new Date(game.dateAchieved).toLocaleDateString()} {new Date(game.dateAchieved).toLocaleTimeString()}
                  </Text>
                </>
              }
              position="top"
              withArrow
            >
              <Box
                style={{ cursor: 'pointer', width: 64, height: 64 }}
                onClick={() => onGameClick(game.gameId)}
              >
                <Image
                  src={`https://media.retroachievements.org${game.imageUrl}`}
                  alt={game.title}
                  width={64}
                  height={64}
                  className={`${styles.wallIcon} ${game.isHardcore ? styles.hardcoreBorder : ''}`}
                />
              </Box>
            </Tooltip>
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
