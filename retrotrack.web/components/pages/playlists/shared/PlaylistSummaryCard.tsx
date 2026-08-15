'use client'

import { Card, Group, Text } from '@mantine/core'
import playlistStyles from '@/css/pages/playlists.module.scss'
import { ReactNode } from 'react'

interface PlaylistSummaryCardProps {
  label: string
  icon: ReactNode
  value: number
  caption: string
}

/**
 * A plain figure tile - label, count, caption.
 *
 * Distinct from PlaylistStatCard, which tracks progress against a total with a
 * bar and a hardcore/softcore split. The public playlist page has no per-user
 * progress to show, so it needs this simpler shape.
 */
export function PlaylistSummaryCard({
  label,
  icon,
  value,
  caption
}: PlaylistSummaryCardProps) {
  return (
    <Card radius="md" p="md" className={playlistStyles.statCard}>
      <Group justify="space-between" mb="xs">
        <Text size="sm" c="dimmed">{label}</Text>
        {icon}
      </Group>
      <Text size="xl" fw={700}>{value.toLocaleString()}</Text>
      <Text size="xs" c="dimmed">{caption}</Text>
    </Card>
  )
}
