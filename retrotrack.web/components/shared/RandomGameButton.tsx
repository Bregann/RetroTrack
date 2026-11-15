'use client'

import { useState } from 'react'
import { Button, MantineSize } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconDice5 } from '@tabler/icons-react'
import { useGameModal } from '@/context/gameModalContext'

interface RandomGameButtonProps {
  /** Resolves to the id of a randomly chosen game, or undefined if there is none */
  getRandomGameId: () => Promise<number | undefined>
  disabled?: boolean
  size?: MantineSize
}

/** Picks a random game and opens it in the game modal. */
export function RandomGameButton({ getRandomGameId, disabled, size = 'md' }: RandomGameButtonProps) {
  const gameModal = useGameModal()
  const [loading, setLoading] = useState(false)

  const openRandomGame = async () => {
    setLoading(true)
    try {
      const gameId = await getRandomGameId()
      if (gameId !== undefined) {
        gameModal.showModal(gameId)
      }
    } catch {
      notifications.show({ color: 'red', title: 'Random game', message: 'Couldn\'t pick a random game, try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="light"
      color="grape"
      size={size}
      style={{ flex: '0 0 auto' }}
      leftSection={<IconDice5 size={16} />}
      loading={loading}
      disabled={disabled}
      onClick={openRandomGame}
    >
      Random Game
    </Button>
  )
}
