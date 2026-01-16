import { Box, Card, Group, Title, Badge, ScrollArea, Stack, Text } from '@mantine/core'
import { IconTrophy, IconCrown } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLeaderboardsFromGameIdResponse } from '@/interfaces/api/games/GetLeaderboardsFromGameIdResponse'
import pageStyles from '@/css/pages/gamePage.module.scss'

interface AchievementLeaderboardsSidebarProps {
  gameId: number
}

export function AchievementLeaderboardsSidebar({ gameId }: AchievementLeaderboardsSidebarProps) {
  const { data: achievementLeaderboardsData } = useQuery({
    queryKey: ['getAchievementLeaderboards', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLeaderboardsFromGameIdResponse>(`/api/games/GetLeaderboardsFromGameId/${gameId}`)
  })

  if (!achievementLeaderboardsData || achievementLeaderboardsData.totalLeaderboards === 0) {
    return null
  }

  return (
    <Box style={{ flex: '1', minWidth: 280, maxWidth: 320 }}>
      <Card withBorder p="md" style={{ position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflow: 'hidden' }} className={pageStyles.leaderboardCard}>
        <Group mb="md" justify="space-between">
          <Title order={3} size="h4">
            <Group gap="xs">
              <IconTrophy size={20} />
              Leaderboards
            </Group>
          </Title>
          <Badge variant="light" size="sm">
            {achievementLeaderboardsData.totalLeaderboards} leaderboards
          </Badge>
        </Group>

        <ScrollArea h={500}>
          <Stack gap="sm">
            {achievementLeaderboardsData.leaderboards.map((leaderboard) => (
              <Card
                key={leaderboard.leaderboardId}
                withBorder
                p="xs"
                style={{
                  backgroundColor: 'light-dark(#f8f9fa, #25262b)',
                  borderColor: 'light-dark(#dee2e6, #373a40)'
                }}
              >
                <Stack gap="xs">
                  {/* Leaderboard Title */}
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} size="xs" lineClamp={1}>
                        {leaderboard.title}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1} style={{ fontSize: '0.7rem' }}>
                        {leaderboard.description}
                      </Text>
                    </Box>
                  </Group>

                  {/* Top Entry */}
                  <Box
                    p="xs"
                    style={{
                      backgroundColor: 'light-dark(#fff9e6, #2d2a1f)',
                      borderRadius: 4,
                      border: '1px solid gold'
                    }}
                  >
                    <Group justify="space-between" align="center">
                      <Group gap="xs">
                        <IconCrown size={12} color="gold" />
                        <Text fw={600} size="xs">
                          {leaderboard.topUser}
                        </Text>
                      </Group>
                      <Text fw={700} size="xs" c="yellow">
                        {leaderboard.topScore}
                      </Text>
                    </Group>
                  </Box>

                  {/* Author */}
                  <Group gap="xs" justify="flex-end">
                    <Text size="xs" c="dimmed" style={{ fontSize: '0.65rem' }}>
                      by {leaderboard.author}
                    </Text>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        </ScrollArea>
      </Card>
    </Box>
  )
}
