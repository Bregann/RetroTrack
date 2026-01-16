import { Accordion, Group, Box, Text, Badge, Stack, SimpleGrid } from '@mantine/core'
import { PublicSubsetGame } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { AchievementCard } from '../shared/AchievementCard'
import { AchievementType } from '@/enums/achievementType'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface PublicSubsetAchievementSetProps {
  subset: PublicSubsetGame
  isSmall: boolean
  showProgressionOnly: boolean
  showMissableOnly: boolean
}

export function PublicSubsetAchievementSet({
  subset,
  isSmall,
  showProgressionOnly,
  showMissableOnly,
}: PublicSubsetAchievementSetProps) {
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
              {subset.achievementCount} achievements ({subset.points} points)
            </Text>
          </div>
          <Badge color="blue" variant="light">
            Subset
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <SimpleGrid cols={isSmall ? 1 : 2} spacing="sm">
            {subset.achievements
              .sort((a, b) => {
                const aSort = a.achievementOrder !== 0 ? a.achievementOrder : a.id
                const bSort = b.achievementOrder !== 0 ? b.achievementOrder : b.id
                return aSort - bSort
              })
              .filter((x) => {
                if (showProgressionOnly && showMissableOnly) {
                  return (
                    x.type === AchievementType.Progression ||
                    x.type === AchievementType.Missable ||
                    x.type === AchievementType.Win_Condition
                  )
                }
                if (showProgressionOnly) {
                  return (
                    x.type === AchievementType.Progression ||
                    x.type === AchievementType.Win_Condition
                  )
                }
                if (showMissableOnly) {
                  return x.type === AchievementType.Missable
                }
                return true
              })
              .map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={{
                    ...achievement,
                    dateEarnedSoftcore: null,
                    dateEarnedHardcore: null,
                  }}
                />
              ))
            }
          </SimpleGrid>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
