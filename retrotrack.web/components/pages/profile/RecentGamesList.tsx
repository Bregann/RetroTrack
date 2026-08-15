'use client'

import { Card, Divider, Group, Stack, Text } from '@mantine/core'
import { IconLock } from '@tabler/icons-react'
import Image from 'next/image'
import styles from '@/css/pages/profile.module.scss'
import { Last5 } from '@/interfaces/api/users/GetUserProfileResponse'
import { HighestAwardKind } from '@/enums/highestAwardKind'
import awardHelper from '@/helpers/awardHelper'

interface RecentGamesListProps {
  label: string
  games: Last5[]
  /** The awards list shows each game's highest award; the played list does not */
  showAward?: boolean
  onGameClick: (_gameId: number) => void
  /** Passed through to the Divider so the second list can space itself */
  mt?: string
}

/**
 * A short list of recently played or recently awarded games.
 *
 * Both lists render the same Last5 shape; only the award line differs, so this
 * replaces two near-identical blocks.
 */
export function RecentGamesList({
  label,
  games,
  showAward = false,
  onGameClick,
  mt
}: RecentGamesListProps) {
  return (
    <>
      <Divider
        label={label}
        labelPosition="center"
        mb="md"
        mt={mt}
        classNames={{ label: styles.dividerText }}
      />
      <Stack gap="sm">
        {games.map((game) => (
          <Card
            key={game.gameId}
            radius="md"
            p="sm"
            className={styles.lastPlayedCard}
            style={{ cursor: 'pointer' }}
            onClick={() => onGameClick(game.gameId)}
          >
            <Stack gap="xs">
              <Group gap="xs">
                <Image
                  src={`https://media.retroachievements.org${game.imageUrl}`}
                  alt={game.title}
                  width={48}
                  height={48}
                  className={styles.lastPlayedIcon}
                />
                <Text fw={600} size="md" className={styles.lastPlayedText}>
                  {game.title}
                </Text>
              </Group>

              {showAward && (
                <Text
                  ta="center"
                  c={game.highestAward === null || game.highestAward === HighestAwardKind.Unknown
                    ? 'dimmed'
                    : awardHelper.getAwardColour(game.highestAward)}
                >
                  Status: {awardHelper.getAwardLabel(game.highestAward)}
                </Text>
              )}

              <Group gap="md" style={{ justifyContent: 'center', width: '100%' }}>
                <Group gap="xs" align="center" justify="center">
                  <IconLock size={16} color="yellow" />
                  <Text size="xs" c="dimmed">
                    {game.achievementsUnlockedSoftcore}/{game.totalGameAchievements}
                  </Text>
                </Group>
              </Group>
            </Stack>
          </Card>
        ))}
      </Stack>
    </>
  )
}
