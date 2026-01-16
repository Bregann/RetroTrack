import { SimpleGrid, Card, Stack, ThemeIcon, Text, Group } from '@mantine/core'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconBuilding,
  IconTools,
  IconUsers,
  IconCheck,
  IconClock,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'

interface GameStatsCardsProps {
  gameId: number
}

export function GameStatsCards({ gameId }: GameStatsCardsProps) {
  const { data } = useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
  })

  if (!data) return null

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="md">
      {/* Progress Card */}
      <Card withBorder>
        <Stack align="center" gap={6}>
          <ThemeIcon size="xl" radius="md" color="yellow">
            <IconTrophy size={24} />
          </ThemeIcon>
          <Text fw={700} ta="center">Progress</Text>
          <Stack gap="xs" justify="center" ta="center">
            <Text size="sm" fw={600}>
              {data.achievementsAwardedTotal.toLocaleString()}/{data.achievementCount.toLocaleString()} Achievements
            </Text>
            <Text size="sm" fw={600}>
              {data.pointsAwardedTotal.toLocaleString()}/{data.totalGamePoints.toLocaleString()} Points
            </Text>
            <Text size="sm" c="dimmed">
              {((data.achievementsAwardedTotal / data.achievementCount) * 100).toFixed(2)}% complete
            </Text>
            {data.achievementsAwardedSoftcore !== data.achievementsAwardedHardcore && (
              <Text size="sm" c="cyan">SC: {data.achievementsAwardedSoftcore}</Text>
            )}
            {data.achievementsAwardedHardcore !== 0 && (
              <Text size="sm" c="orange">HC: {data.achievementsAwardedHardcore}</Text>
            )}
          </Stack>
        </Stack>
      </Card>

      {/* Game Info Card */}
      <Card withBorder radius="md" p="md">
        <Stack align="center" gap="sm">
          <ThemeIcon size="xl" radius="md" color="violet">
            <IconDeviceGamepad size={24} />
          </ThemeIcon>
          <Text fw={700}>Game Info</Text>

          <Group gap="xl" align="flex-start" justify="center" style={{ width: '100%' }}>
            <Stack gap="4">
              <Group gap="xs">
                <IconDeviceGamepad size={16} />
                <Text size="sm">{data.consoleName}</Text>
              </Group>
              <Group gap="xs">
                <IconStar size={16} />
                <Text size="sm">{data.genre !== '' || 'Not Set'}</Text>
              </Group>
            </Stack>

            <Stack gap="4">
              <Group gap="xs">
                <IconBuilding size={16} />
                <Text size="sm">Publisher: {data.publisher !== '' || 'Not Set'}</Text>
              </Group>
              <Group gap="xs">
                <IconTools size={16} />
                <Text size="sm">Developer: {data.developer !== '' || 'Not Set'}</Text>
              </Group>
            </Stack>
          </Group>

          <Group gap="xs">
            <IconUsers size={16} />
            <Text size="sm">{data.players} Players</Text>
          </Group>
        </Stack>
      </Card>

      {/* Completion State Card */}
      <Card withBorder>
        <Stack align="center" gap={6}>
          <ThemeIcon size="xl" radius="md" color="teal">
            <IconCheck size={24} />
          </ThemeIcon>
          <Text fw={700} ta="center">Completion State</Text>
          <Stack gap={4}>
            <Group gap="6" justify="center">
              <IconDeviceGamepad size={16} />
              <Text>Date Beaten:</Text>
            </Group>

            <Text size="sm" c="dimmed" ta="center">
              {data.dateBeatenHardcore === null && data.dateBeatenSoftcore === null
                ? 'N/A'
                : data.dateBeatenHardcore ?? data.dateBeatenSoftcore}
            </Text>

            <Group gap="6" justify="center" mt={10}>
              <IconDeviceGamepad size={16} />
              <Text>Date Completed/Mastered:</Text>
            </Group>
            <Text size="sm" c="dimmed" ta="center">
              {data.dateMastered === null && data.dateCompleted === null
                ? 'N/A'
                : data.dateMastered ?? data.dateCompleted}
            </Text>
          </Stack>
        </Stack>
      </Card>

      {/* Time Stats Card */}
      <Card withBorder>
        <Stack align="center" justify="center" h="100%" gap="sm">
          <ThemeIcon size="xl" radius="md" color="grape">
            <IconClock size={24} />
          </ThemeIcon>
          <Text fw={700} ta="center">Time Stats</Text>
          {(data.medianTimeToBeatHardcoreFormatted !== null || data.medianTimeToMasterFormatted !== null) ? (
            <Stack gap="xs" ta="center">
              <Text size="sm">Median Time to Beat: {data.medianTimeToBeatHardcoreFormatted ?? 'N/A'}</Text>
              <Text size="sm">Median Time to Master: {data.medianTimeToMasterFormatted ?? 'N/A'}</Text>
            </Stack>
          ) : (
            <Text size="sm" c="dimmed" ta="center">Not enough data recorded</Text>
          )}
        </Stack>
      </Card>
    </SimpleGrid>
  )
}
