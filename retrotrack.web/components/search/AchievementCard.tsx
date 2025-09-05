'use client'

import { Card, Group, Stack, Text, Badge, Button, Box } from '@mantine/core'
import { IconTrophy } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/search.module.scss'
import { AchievementSearchResult } from '@/interfaces/api/search/DoSearchResponse'
import { useGameModal } from '@/context/gameModalContext'

interface AchievementCardProps {
  achievement: AchievementSearchResult
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const gameModal = useGameModal()

  return (
    <Card
      key={achievement.achievementId}
      className={styles.searchCard}
      radius="md"
      p="md"
      style={{ cursor: 'pointer' }}
      onClick={() => gameModal.showModal(achievement.gameId)}
    >
      <Group gap="md" align="flex-start">
        <Box className={styles.imageContainer}>
          <Image
            src={`https://media.retroachievements.org/Badge/${achievement.iconUrl}.png`}
            alt={achievement.title}
            width={64}
            height={64}
            style={{ objectFit: 'contain', borderRadius: '8px' }}
          />
        </Box>
        <Stack gap="xs" style={{ flex: 1 }}>
          <Group justify="space-between" align="flex-start">
            <div>
              <Text fw={600} size="md" className={styles.achievementTitle}>
                {achievement.title}
              </Text>
              <Text size="sm" c="dimmed" mb="xs">
                {achievement.gameTitle} • {achievement.console}
              </Text>
              <Text size="sm">
                {achievement.description}
              </Text>
            </div>
            <Group gap="xs">
              <Badge variant="light" color="orange">
                <IconTrophy size={12} style={{ marginRight: 4 }} />
                Achievement
              </Badge>
            </Group>
          </Group>
          <Text size="sm" fw={500} c="blue">
            {achievement.points} points
          </Text>
          <Group mt="md" gap="xs">
            <Button
              size="xs"
              variant="filled"
              onClick={(event) => {
                event.stopPropagation()
                gameModal.showModal(achievement.gameId)
              }}
            >
              Game Modal
            </Button>
            <Button
              size="xs"
              variant="filled"
              onClick={(event) => {
                event.stopPropagation()
                window.open(`/game/${achievement.gameId}`, '_blank')
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
