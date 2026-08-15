'use client'

import { Card, Group, Progress, Text } from '@mantine/core'
import playlistStyles from '@/css/pages/playlists.module.scss'
import { ReactNode } from 'react'

interface PlaylistStatCardProps {
  label: string
  icon: ReactNode
  /** The achieved figure, already summed by the caller */
  value: number
  /** Omit for a card with no denominator, e.g. total points */
  total?: number
  percentage?: number
  progressColour?: string
  /** Hardcore / softcore split, shown only when the two differ */
  hardcore?: number
  softcore?: number
}

/**
 * One tile in the playlist progress grid.
 *
 * The four tiles previously repeated this markup - including the fiddly
 * hardcore/softcore footnote - four times over, each with its own copy of the
 * "only show the split when the counts differ" condition.
 */
export function PlaylistStatCard({
  label,
  icon,
  value,
  total,
  percentage,
  progressColour,
  hardcore,
  softcore
}: PlaylistStatCardProps) {
  // Only worth showing the breakdown when a softcore figure exists and the two differ
  const showSplit = softcore !== undefined
    && softcore !== 0
    && hardcore !== softcore

  return (
    <Card radius="md" p="md" className={playlistStyles.statCard}>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed">{label}</Text>
        {icon}
      </Group>

      <Group align="baseline" gap={4}>
        <Text size="xl" fw={700}>{value.toLocaleString()}</Text>
        {total !== undefined && (
          <Text size="sm" c="dimmed">/{total.toLocaleString()}</Text>
        )}
      </Group>

      {percentage !== undefined && (
        <>
          <Text size="xs" c="dimmed" mb="xs">{percentage}%</Text>
          <Progress value={percentage} size="xs" color={progressColour} />
        </>
      )}

      {showSplit && (
        <Text size="xs" c="dimmed" mt="xs">
          {hardcore === 0 || hardcore === undefined
            ? `Casual: ${softcore.toLocaleString()}`
            : `Hardcore: ${hardcore.toLocaleString()} | Casual: ${softcore.toLocaleString()}`}
        </Text>
      )}
    </Card>
  )
}
