import { Accordion, Group, Box, Text, Badge, Stack, SimpleGrid } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { AchievementCard } from '../shared/AchievementCard'
import { AchievementType } from '@/enums/achievementType'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface PublicMainAchievementSetProps {
  gameId: number
  isSmall: boolean
  showProgressionOnly: boolean
  showMissableOnly: boolean
}

export function PublicMainAchievementSet({
  gameId,
  isSmall,
  showProgressionOnly,
  showMissableOnly,
}: PublicMainAchievementSetProps) {
  const { data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`)
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
              {data.achievementCount} achievements
            </Text>
          </div>
          <Badge color="gray" variant="light">
            Base Set
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack gap="md">
          <SimpleGrid cols={isSmall ? 1 : 2} spacing="sm">
            {data.achievements
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
