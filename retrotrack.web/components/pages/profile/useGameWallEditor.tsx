'use client'

import { useState } from 'react'
import { DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { IconCheck, IconInfoCircle } from '@tabler/icons-react'
import { GamesWall } from '@/interfaces/api/users/GetUserProfileResponse'
import { useMutationApiData } from '@/helpers/mutations/useMutationApiData'
import notificationHelper from '@/helpers/notificationHelper'

/** Which of the two walls an action refers to */
export type WallKind = 'beaten' | 'mastered'

interface UseGameWallEditorOptions {
  username: string
  beatenWall: GamesWall[]
  masteredWall: GamesWall[]
}

/**
 * Drag-to-reorder editing for the two profile game walls.
 *
 * Holds a draft per wall so a reorder can be cancelled, and only writes to the
 * API on save. The wall being saved is tracked explicitly rather than inferred
 * from which draft happens to be non-null - the previous version re-derived it
 * inside onSuccess, which cleared the wrong draft if both were open.
 */
export function useGameWallEditor({
  username,
  beatenWall,
  masteredWall
}: UseGameWallEditorOptions) {
  const [drafts, setDrafts] = useState<Record<WallKind, GamesWall[] | null>>({
    beaten: null,
    mastered: null
  })
  const [savingWall, setSavingWall] = useState<WallKind | null>(null)

  const { mutateAsync } = useMutationApiData({
    url: '/api/users/SaveUserGameWallPositions',
    queryKey: ['GetUserProfile', username],
    invalidateQuery: true,
    apiMethod: 'POST',
    onError: () => {
      notificationHelper.showErrorNotification(
        'Error',
        'Failed to save wall positions.',
        3000,
        <IconInfoCircle size={16} />
      )
    }
  })

  const startEditing = (wall: WallKind) => {
    setDrafts((current) => ({
      ...current,
      [wall]: wall === 'beaten' ? beatenWall : masteredWall
    }))
  }

  const cancelEditing = (wall: WallKind) => {
    setDrafts((current) => ({ ...current, [wall]: null }))
  }

  const reorder = (wall: WallKind, event: DragEndEvent) => {
    const { active, over } = event

    if (over === null || active.id === over.id) {
      return
    }

    setDrafts((current) => {
      const items = current[wall]

      if (items === null) {
        return current
      }

      const oldIndex = items.findIndex((g) => g.gameId === active.id)
      const newIndex = items.findIndex((g) => g.gameId === over.id)

      if (oldIndex === -1 || newIndex === -1) {
        return current
      }

      // wallPosition is what the API persists, so realign it with the new order
      const reordered = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
        ...item,
        wallPosition: index
      }))

      return { ...current, [wall]: reordered }
    })
  }

  const save = async (wall: WallKind) => {
    if (savingWall !== null) {
      return
    }

    const wallData = drafts[wall]

    if (wallData === null) {
      return
    }

    setSavingWall(wall)

    try {
      await mutateAsync({
        wallData: wallData.map((game) => ({
          progressId: game.progressId,
          wallPosition: game.wallPosition
        }))
      })

      // Only clear the draft once the save actually succeeded, so a failure
      // leaves the user's reordering intact to retry
      setDrafts((current) => ({ ...current, [wall]: null }))

      notificationHelper.showSuccessNotification(
        'Success',
        wall === 'beaten'
          ? 'Beaten games wall positions saved successfully.'
          : 'Mastered games wall positions saved successfully.',
        3000,
        <IconCheck size={16} />
      )
    } catch {
      // The mutation's onError already notified; keep the draft for a retry
    } finally {
      setSavingWall(null)
    }
  }

  return {
    drafts,
    isSaving: savingWall !== null,
    startEditing,
    cancelEditing,
    reorder,
    save
  }
}
