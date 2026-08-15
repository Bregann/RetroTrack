'use client'

import { Card, Group, Stack, Text } from '@mantine/core'
import styles from '@/css/pages/profile.module.scss'
import { ReactNode } from 'react'

interface ProfileStatCardProps {
  label: string
  icon: ReactNode
  value: number
  /** Mantine colour token for the figure */
  colour: string
}

/** One centred figure tile in the profile's stat row. */
export function ProfileStatCard({ label, icon, value, colour }: ProfileStatCardProps) {
  return (
    <Card radius="md" p="md" className={styles.statCard}>
      <Stack align="center" gap="xs">
        <Group justify="center" align="center" gap="xs">
          <Text size="sm" fw={600} ta="center">{label}</Text>
          {icon}
        </Group>
        <Text size="lg" fw={700} c={colour}>
          {value.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  )
}
