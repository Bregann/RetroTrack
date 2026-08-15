'use client'

import { Card, Divider, Progress, Stack, Text } from '@mantine/core'
import styles from '@/css/pages/profile.module.scss'
import { ConsoleProgressDatum } from '@/interfaces/api/users/GetUserProfileResponse'

interface ConsoleProgressCardProps {
  consoleData: ConsoleProgressDatum
}

interface ProgressRowProps {
  label: string
  earned: number
  total: number
  percentage: number
  colour: string
  /** Beaten rows sit under a divider; the completed/mastered rows do not */
  withDivider?: boolean
}

/** One labelled progress line within a console card. */
function ProgressRow({
  label,
  earned,
  total,
  percentage,
  colour,
  withDivider = false
}: ProgressRowProps) {
  return (
    <>
      {withDivider && <Divider />}
      <Text size="sm" c="dimmed">
        {label}: <Text component="span" c={colour} fw={600}>
          {earned.toLocaleString()}/{total.toLocaleString()} ({percentage}%)
        </Text>
      </Text>
      <Progress value={percentage} size="xs" color={colour} />
    </>
  )
}

/**
 * A console's progress breakdown, showing only the tiers the user has reached.
 *
 * The four tiers previously repeated the same label/progress markup inline, each
 * wrapped in its own zero-check.
 */
export function ConsoleProgressCard({ consoleData }: ConsoleProgressCardProps) {
  const hasNoProgress = consoleData.gamesBeatenSoftcore === 0
    && consoleData.gamesBeatenHardcore === 0
    && consoleData.gamesCompleted === 0
    && consoleData.gamesMastered === 0

  return (
    <Card radius="md" p="lg" className={styles.consoleCard}>
      <Stack gap="md">
        <Text fw={700} size="lg">{consoleData.consoleName}</Text>

        {hasNoProgress && (
          <Text c="dimmed" size="sm">No progress made on this console.</Text>
        )}

        <Stack gap="xs">
          {consoleData.gamesBeatenSoftcore !== 0 && (
            <ProgressRow
              label="Casual Beaten"
              earned={consoleData.gamesBeatenSoftcore}
              total={consoleData.totalGamesInConsole}
              percentage={consoleData.percentageBeatenSoftcore}
              colour="blue"
              withDivider
            />
          )}

          {consoleData.gamesBeatenHardcore !== 0 && (
            <ProgressRow
              label="Hardcore Beaten"
              earned={consoleData.gamesBeatenHardcore}
              total={consoleData.totalGamesInConsole}
              percentage={consoleData.percentageBeatenHardcore}
              colour="orange"
              withDivider
            />
          )}

          {consoleData.gamesCompleted !== 0 && (
            <ProgressRow
              label="Casual Completed"
              earned={consoleData.gamesCompleted}
              total={consoleData.totalGamesInConsole}
              percentage={consoleData.percentageCompleted}
              colour="teal"
            />
          )}

          {consoleData.gamesMastered !== 0 && (
            <ProgressRow
              label="Hardcore Mastered"
              earned={consoleData.gamesMastered}
              total={consoleData.totalGamesInConsole}
              percentage={consoleData.percentageMastered}
              colour="yellow"
            />
          )}
        </Stack>
      </Stack>
    </Card>
  )
}
