// app/loading.tsx
'use client'

import { Text, Stack, ThemeIcon } from '@mantine/core'
import { IconDeviceGamepad } from '@tabler/icons-react'

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        width: '85vw',
        height: '85vh',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Stack align="center" gap="md">
        <ThemeIcon
          size={60}
          radius="xl"
          variant="light"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <IconDeviceGamepad size={32} color="#4EA8DE" />
        </ThemeIcon>

        <Text size="lg" c="gray.4" fw={500}>
          Loading Console...
        </Text>
      </Stack>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
