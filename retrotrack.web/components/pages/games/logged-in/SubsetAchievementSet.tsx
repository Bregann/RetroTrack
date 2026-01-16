import { Accordion, Group, Box, Text, Badge, Stack, Progress, SimpleGrid, Button } from '@mantine/core'
import { SubsetGame } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { AchievementCard } from '../shared/AchievementCard'
import { AchievementType } from '@/enums/achievementType'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface SubsetAchievementSetProps {
  subset: SubsetGame
  isSmall: boolean
  hideUnlocked: boolean
  showProgressionOnly: boolean
  showMissableOnly: boolean
  onUpdateGame: () => Promise<void>
}

export function SubsetAchievementSet({
  subset,
  isSmall,
  hideUnlocked,
  showProgressionOnly,
  showMissableOnly,
  onUpdateGame,
}: SubsetAchievementSetProps) {
  const unlockedCount = subset.achievements.filter(a => a.dateEarnedHardcore || a.dateEarnedSoftcore).length
  const hardcoreCount = subset.achievements.filter(a => a.dateEarnedHardcore).length
  const softcoreOnlyCount = subset.achievements.filter(a => a.dateEarnedSoftcore && !a.dateEarnedHardcore).length

  return (
    <Accordion.Item value={subset.gameId.toString()}>
      <Accordion.Control>
        <Group gap="md" wrap="nowrap">
          <Box className={styles.iconBox}>
            <Image
              src={`https://media.retroachievements.org${subset.gameImage}`}
              alt="Game Icon"
              width={64}
              height={64}
              style={{ borderRadius: '4px' }}
              className={styles.gameIcon}
            />
          </Box>
          <div style={{ flex: 1 }}>
            <Text fw={600}>{subset.title}</Text>
            <Text size="sm" c="dimmed">
              {unlockedCount}/{subset.achievementCount} achievements ({subset.points} points)
            </Text>
          </div>
          <Badge
            color={unlockedCount === subset.achievementCount ? 'green' : unlockedCount > 0 ? 'cyan' : 'gray'}
            variant="light"
          >
            {((unlockedCount / subset.achievementCount) * 100).toFixed(1)}%
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <Progress.Root size={20}>
            {hardcoreCount > 0 && (
              <Progress.Section
                value={(hardcoreCount / subset.achievementCount) * 100}
                color="orange"
              >
                <Progress.Label>
                  Hardcore ({hardcoreCount})
                </Progress.Label>
              </Progress.Section>
            )}
            {softcoreOnlyCount > 0 && (
              <Progress.Section
                value={(softcoreOnlyCount / subset.achievementCount) * 100}
                color="cyan"
              >
                <Progress.Label>
                  Softcore ({softcoreOnlyCount})
                </Progress.Label>
              </Progress.Section>
            )}
            <Progress.Section
              value={((subset.achievementCount - unlockedCount) / subset.achievementCount) * 100}
              color="grey"
            >
              <Progress.Label>
                Locked ({subset.achievementCount - unlockedCount})
              </Progress.Label>
            </Progress.Section>
          </Progress.Root>

          <Group justify="space-between">
            <Button
              size="sm"
              variant="light"
              onClick={onUpdateGame}
            >
              Update This Subset
            </Button>
            <Button
              size="sm"
              variant="light"
              component="a"
              href={`/game/${subset.gameId}`}
              target="_blank"
            >
              View Full Page
            </Button>
          </Group>

          <SimpleGrid cols={isSmall ? 1 : 2} spacing="sm">
            {subset.achievements
              .sort((a, b) => {
                const aUnlocked = a.dateEarnedSoftcore !== null || a.dateEarnedHardcore !== null
                const bUnlocked = b.dateEarnedSoftcore !== null || b.dateEarnedHardcore !== null
                if (aUnlocked !== bUnlocked) {
                  return aUnlocked ? -1 : 1
                }
                const aSort = a.achievementOrder !== 0 ? a.achievementOrder : a.id
                const bSort = b.achievementOrder !== 0 ? b.achievementOrder : b.id
                return aSort - bSort
              })
              .filter((x) => {
                const isUnlocked = x.dateEarnedSoftcore !== null || x.dateEarnedHardcore !== null
                const matchesHidden = !hideUnlocked || !isUnlocked
                const matchesProgression =
                  !showProgressionOnly ||
                  x.type === AchievementType.Progression ||
                  x.type === AchievementType.Win_Condition
                const matchesMissable =
                  !showMissableOnly || x.type === AchievementType.Missable

                return matchesHidden && matchesProgression && matchesMissable
              })
              .map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            }
          </SimpleGrid>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
