'use client'

import { Avatar, Box, Card, Group, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import styles from '@/css/pages/profile.module.scss'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'

interface ProfileHeaderCardProps {
  profile: GetUserProfileResponse
}

/** Avatar, username, points summary and the last-updated note. */
export function ProfileHeaderCard({ profile }: ProfileHeaderCardProps) {
  // Only worth showing the casual figure when it differs from hardcore
  const showCasualPoints = profile.softcorePoints !== profile.hardcorePoints
    && profile.softcorePoints !== 0

  return (
    <Card radius="md" p="lg" mb="xl" className={styles.profileHeaderCard}>
      <Group align="flex-start" wrap="nowrap" gap="lg">
        <Avatar
          src={`https://media.retroachievements.org/UserPic/${profile.raUsername}.png`}
          size={120}
          radius="lg"
          className={styles.profileAvatar}
        />
        <Stack style={{ flex: 1 }} gap="sm">
          <Title order={1} size="2rem" mb="xs">{profile.raUsername}</Title>

          <Group gap="xl">
            <Stack gap={2}>
              {showCasualPoints && (
                <Text size="lg">
                  Casual Points: <Text component="span" fw={700} c="blue">{profile.softcorePoints.toLocaleString()}</Text>
                </Text>
              )}
              {profile.hardcorePoints !== 0 && (
                <Text size="lg">
                  Hardcore Points: <Text component="span" fw={700} c="gold">{profile.hardcorePoints.toLocaleString()}</Text>
                </Text>
              )}
            </Stack>
          </Group>

          {profile.lastUserUpdate !== undefined && (
            <Group gap="md" mt="sm">
              <Text size="sm" c="dimmed">
                Last Updated: {new Date(profile.lastUserUpdate).toLocaleDateString()} {new Date(profile.lastUserUpdate).toLocaleTimeString()}
              </Text>
              <Tooltip
                label="If you are not registered, data is cached for 30 minutes unless you are registered and logged in"
                withArrow
              >
                <Box component="span" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                  <IconInfoCircle size={16} color="gray" />
                </Box>
              </Tooltip>
            </Group>
          )}
        </Stack>
      </Group>
    </Card>
  )
}
