// app/loading.tsx
'use client'

import { Text, Stack, ThemeIcon } from '@mantine/core'
import { IconDeviceGamepad } from '@tabler/icons-react'

export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack align="center" gap="md">
        {/* Retro gamepad icon spinning */}
        <ThemeIcon
          size={60}
          radius="xl"
          variant="light"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <IconDeviceGamepad size={32} color="#4EA8DE" />
        </ThemeIcon>

        {/* Friendly loading text */}
        <Text size="lg" c="gray.4" fw={500}>
          Loading RetroTrack…
        </Text>
      </Stack>

      {/* Keyframes for that spin 🔄 */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
