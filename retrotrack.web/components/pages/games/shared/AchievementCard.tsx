import { Card, Group, Box, Stack, Text, Tooltip, ThemeIcon } from '@mantine/core'
import { IconCheck, IconExclamationMark, IconAward } from '@tabler/icons-react'
import { AchievementType } from '@/enums/achievementType'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface Achievement {
  id: number
  title: string
  description: string
  points: number
  badgeName: string
  type: AchievementType | number | null
  dateEarnedSoftcore: string | null
  dateEarnedHardcore: string | null
}

interface AchievementCardProps {
  achievement: Achievement
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.dateEarnedSoftcore !== null || achievement.dateEarnedHardcore !== null

  return (
    <Card
      withBorder
      radius="sm"
      p="sm"
      style={{
        position: 'relative',
        borderWidth: 2,
        backgroundColor: isUnlocked
          ? 'light-dark(#e8f5e9, #1b3a29)'
          : 'light-dark(#f9f9f9, #263042)',
        borderColor:
          achievement.type === AchievementType.Missable
            ? 'var(--mantine-color-orange-filled)'
            : achievement.type === AchievementType.Progression
              ? 'var(--mantine-color-cyan-filled)'
              : achievement.type === AchievementType.Win_Condition
                ? 'var(--mantine-color-green-filled)'
                : 'transparent',
        opacity: isUnlocked ? 1 : 0.8
      }}
    >
      <Group align="center" gap="md">
        <Box className={styles.iconBox}>
          <Image
            src={`https://media.retroachievements.org/Badge/${achievement.badgeName}`}
            alt="Achievement Icon"
            width={64}
            height={64}
            style={{ objectFit: 'contain', borderRadius: '4px' }}
          />
        </Box>

        <Stack gap={2} style={{ flex: 1 }}>
          <Text fw={500}>{achievement.title}</Text>
          <Text size="sm" c="dimmed">{achievement.description}</Text>
          {achievement.dateEarnedSoftcore !== null && (
            <Text size="xs" c="dimmed" mt={5}>
              Unlocked: {achievement.dateEarnedSoftcore}
            </Text>
          )}
        </Stack>

        <Text fw={600} size="lg" c="yellow" mb={20}>
          {achievement.points}
        </Text>
      </Group>
      {(() => {
        switch (achievement.type) {
          case AchievementType.Progression:
            return (
              <Tooltip label="Progression Achievement" position="top" withArrow>
                <Box className={styles.achievementIconTypeBox}>
                  <ThemeIcon color="cyan" size="sm" radius="xl">
                    <IconCheck size={16} />
                  </ThemeIcon>
                </Box>
              </Tooltip>
            )
          case AchievementType.Missable:
            return (
              <Tooltip label="Missable Achievement" position="top" withArrow>
                <Box className={styles.achievementIconTypeBox}>
                  <ThemeIcon color="orange" size="sm" radius="xl">
                    <IconExclamationMark size={16} />
                  </ThemeIcon>
                </Box>
              </Tooltip>
            )
          case AchievementType.Win_Condition:
            return (
              <Tooltip label="Win Condition" position="top" withArrow>
                <Box className={styles.achievementIconTypeBox}>
                  <ThemeIcon color="green" size="sm" radius="xl">
                    <IconAward size={16} />
                  </ThemeIcon>
                </Box>
              </Tooltip>
            )
          default:
            return null
        }
      })()}
    </Card>
  )
}
