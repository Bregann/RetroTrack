'use client'

import { Card, Group, Stack, Text, Badge, Button, Box } from '@mantine/core'
import { IconDeviceGamepad2 } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/search.module.scss'
import { GameSearchResult } from '@/interfaces/api/search/DoSearchResponse'
import { useGameModal } from '@/context/gameModalContext'

interface GameCardProps {
  game: GameSearchResult
}

export function GameCard({ game }: GameCardProps) {
  const gameModal = useGameModal()

  return (
    <Card
      key={game.gameId}
      className={styles.searchCard}
      radius="md"
      p="md"
      style={{ cursor: 'pointer' }}
      onClick={() => gameModal.showModal(game.gameId)}
    >
      <Group gap="md" align="flex-start">
        <Box className={styles.imageContainer}>
          <Image
            src={`https://media.retroachievements.org/${game.gameIconUrl}`}
            alt={game.title}
            width={80}
            height={80}
            style={{ objectFit: 'contain', borderRadius: '8px' }}
          />
        </Box>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600} size="lg" className={styles.gameTitle}>
                {game.title}
              </Text>
              <Text size="sm" c="dimmed">
                {game.console}
              </Text>
            </div>
            <Badge variant="light" color="blue">
              <IconDeviceGamepad2 size={12} style={{ marginRight: 4 }} />
              Game
            </Badge>
          </Group>
          <Group gap="md">
            <Text size="sm">
              <Text span fw={500}>Achievements:</Text> {game.totalAchievements}
            </Text>
            <Text size="sm">
              <Text span fw={500}>Points:</Text> {game.totalPoints}
            </Text>
            <Text size="sm">
              <Text span fw={500}>Genre:</Text> {game.genre}
            </Text>
          </Group>
          <Group gap="xs" mt="xs">
            <Button
              size="xs"
              variant="filled"
              onClick={(e) => {
                e.stopPropagation()
                gameModal.showModal(game.gameId)
              }}
            >
              Game Modal
            </Button>
            <Button
              size="xs"
              variant="filled"
              onClick={(e) => {
                e.stopPropagation()
                window.open(`/game/${game.gameId}`, '_blank')
              }}
            >
              Game Page
            </Button>
          </Group>
        </Stack>
      </Group>
    </Card>
  )
}
