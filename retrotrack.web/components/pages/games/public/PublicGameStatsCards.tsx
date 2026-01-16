import { SimpleGrid, Card, Stack, ThemeIcon, Text, Group } from '@mantine/core'
import {
  IconTrophy,
  IconStar,
  IconDeviceGamepad,
  IconBuilding,
  IconTools,
  IconUsers,
  IconClock,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'

interface PublicGameStatsCardsProps {
  gameId: number
}

export function PublicGameStatsCards({ gameId }: PublicGameStatsCardsProps) {
  const { data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`)
  })

  if (!data) return null

  return (
    <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} mb="md">
      {/* Game Info Card */}
      <Card withBorder>
        <Stack align="center" gap={6}>
          <ThemeIcon size="xl" radius="md" color="yellow">
            <IconTrophy size={24} />
          </ThemeIcon>
          <Text fw={700} ta="center">Game Info</Text>
          <Stack gap="xs" justify="center" ta="center">
            <Text size="sm" fw={600}>
              {data.achievementCount.toLocaleString()} Achievements
            </Text>
          </Stack>
        </Stack>
      </Card>

      {/* Console Info Card */}
      <Card withBorder radius="md" p="md">
        <Stack align="center" gap="sm">
          <ThemeIcon size="xl" radius="md" color="violet">
            <IconDeviceGamepad size={24} />
          </ThemeIcon>
          <Text fw={700}>Console & Genre</Text>

          <Group gap="xl" align="flex-start" justify="center" style={{ width: '100%' }}>
            <Stack gap="4">
              <Group gap="xs">
                <IconDeviceGamepad size={16} />
                <Text size="sm">{data.consoleName}</Text>
              </Group>
              <Group gap="xs">
                <IconStar size={16} />
                <Text size="sm">{data.genre !== '' ? data.genre : 'Not Set'}</Text>
              </Group>
            </Stack>

            <Stack gap="4">
              <Group gap="xs">
                <IconBuilding size={16} />
                <Text size="sm">Publisher: {data.publisher !== '' ? data.publisher : 'Not Set'}</Text>
              </Group>
              <Group gap="xs">
                <IconTools size={16} />
                <Text size="sm">Developer: {data.developer !== '' ? data.developer : 'Not Set'}</Text>
              </Group>
            </Stack>
          </Group>

          <Group gap="xs">
            <IconUsers size={16} />
            <Text size="sm">{data.players} Players</Text>
          </Group>
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
