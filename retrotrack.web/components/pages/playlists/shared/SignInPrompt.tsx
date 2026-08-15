'use client'

import { Button, Card, Group, Text } from '@mantine/core'
import playlistStyles from '@/css/pages/playlists.module.scss'

interface SignInPromptProps {
  onSignIn: () => void
  /** Provide to show a "Create Account" button alongside sign in */
  onRegister?: () => void
  /** 'banner' is the prominent card above the fold; 'footer' the compact strip below the table */
  variant?: 'banner' | 'footer'
}

/**
 * Invites a logged-out visitor to sign in so they can track progress.
 *
 * The public playlist page shows this twice - once as a banner at the top and
 * once as a slimmer strip under the table - which previously meant two separate
 * blocks of near-identical markup.
 */
export function SignInPrompt({
  onSignIn,
  onRegister,
  variant = 'banner'
}: SignInPromptProps) {
  if (variant === 'footer') {
    return (
      <Group
        justify="space-between"
        align="center"
        mt="md"
        p="sm"
        className={playlistStyles.signInFooter}
      >
        <Text size="sm" c="dimmed">
          Sign in to track your progress on these games
        </Text>
        <Group gap="xs">
          <Button variant="filled" color="blue" size="xs" onClick={onSignIn}>
            Sign In
          </Button>
          {onRegister !== undefined && (
            <Button variant="outline" color="blue" size="xs" onClick={onRegister}>
              Create Account
            </Button>
          )}
        </Group>
      </Group>
    )
  }

  return (
    <Card radius="md" p="md" className={playlistStyles.infoBanner} style={{ flex: 1 }}>
      <Group justify="space-between" align="center">
        <Group gap="md">
          <div>
            <Text fw={500} mb="xs">
              Sign in to track your progress on these games!
            </Text>
            <Text size="sm" c="dimmed">
              See your achievements, completion status, and personal stats for each game in this playlist.
            </Text>
          </div>
        </Group>
        <Button variant="filled" color="blue" onClick={onSignIn}>
          Sign In
        </Button>
      </Group>
    </Card>
  )
}
