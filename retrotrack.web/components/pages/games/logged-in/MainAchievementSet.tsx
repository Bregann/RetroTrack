import { Accordion, Group, Box, Text, Badge, Stack, Progress, SimpleGrid } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { AchievementCard } from '../shared/AchievementCard'
import { AchievementFilters } from './AchievementFilters'
import { UserNotesSection } from './UserNotesSection'
import { AchievementType } from '@/enums/achievementType'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface MainAchievementSetProps {
  gameId: number
  isSmall: boolean
  hideUnlocked: boolean
  showProgressionOnly: boolean
  showMissableOnly: boolean
  onHideUnlockedChange: (_checked: boolean) => void
  onShowProgressionOnlyChange: (_checked: boolean) => void
  onShowMissableOnlyChange: (_checked: boolean) => void
}

export function MainAchievementSet({
  gameId,
  isSmall,
  hideUnlocked,
  showProgressionOnly,
  showMissableOnly,
  onHideUnlockedChange,
  onShowProgressionOnlyChange,
  onShowMissableOnlyChange,
}: MainAchievementSetProps) {
  const { data } = useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
  })

  if (!data) return null

  return (
    <Accordion.Item value="main-set">
      <Accordion.Control>
        <Group gap="md" wrap="nowrap">
          <Box className={styles.iconBox}>
            <Image
              src={`https://media.retroachievements.org${data.gameImage}`}
              alt="Game Icon"
              width={64}
              height={64}
              style={{ borderRadius: '4px' }}
              className={styles.gameIcon}
            />
          </Box>
          <div style={{ flex: 1 }}>
            <Text fw={600}>{data.title}</Text>
            <Text size="sm" c="dimmed">
              {data.achievementsAwardedTotal}/{data.achievementCount} achievements ({data.totalGamePoints} points)
            </Text>
          </div>
          <Badge
            color={data.achievementsAwardedTotal === data.achievementCount ? 'green' : data.achievementsAwardedTotal > 0 ? 'cyan' : 'gray'}
            variant="light"
          >
            {((data.achievementsAwardedTotal / data.achievementCount) * 100).toFixed(1)}%
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <Progress.Root size={20} className={styles.progressBar}>
            {data.achievementsAwardedHardcore != 0 && (
              <Progress.Section value={data.achievementsAwardedHardcore} color="orange">
                <Progress.Label>Hardcore ({data.achievementsAwardedHardcore})</Progress.Label>
              </Progress.Section>
            )}
            {data.achievementsAwardedSoftcore !== data.achievementsAwardedHardcore && (
              <Progress.Section value={data.achievementsAwardedSoftcore} color="cyan">
                <Progress.Label>Softcore ({data.achievementsAwardedSoftcore})</Progress.Label>
              </Progress.Section>
            )}
            <Progress.Section value={data.achievementCount - data.achievementsAwardedTotal} color="grey">
              <Progress.Label>Locked ({data.achievementCount - data.achievementsAwardedTotal})</Progress.Label>
            </Progress.Section>
          </Progress.Root>

          <AchievementFilters
            hideUnlocked={hideUnlocked}
            showProgressionOnly={showProgressionOnly}
            showMissableOnly={showMissableOnly}
            onHideUnlockedChange={onHideUnlockedChange}
            onShowProgressionOnlyChange={onShowProgressionOnlyChange}
            onShowMissableOnlyChange={onShowMissableOnlyChange}
          />

          <UserNotesSection gameId={gameId} />

          <SimpleGrid cols={isSmall ? 1 : 2} spacing="sm">
            {data.achievements
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
                if (hideUnlocked) {
                  return x.dateEarnedSoftcore === null || x.dateEarnedHardcore === null
                }
                return true
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
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))
            }
          </SimpleGrid>
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}
