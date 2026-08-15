'use client'

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Image,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { IconEdit, IconHeart } from '@tabler/icons-react'
import playlistStyles from '@/css/pages/playlists.module.scss'
/**
 * Only the fields both the public and logged-in responses share. Typing the prop
 * this way lets one header serve both pages without either response type
 * depending on the other.
 */
export interface PlaylistHeaderData {
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
  numberOfGames: number
  numberOfConsoles: number
  numberOfLikes: number
  icons: string[]
  isPublic?: boolean
  isPlaylistOwner?: boolean
  isLiked?: boolean
}

interface PlaylistHeaderCardProps {
  playlist: PlaylistHeaderData
  /** Owner-only; omit to hide the edit pencil */
  onEdit?: () => void
  /** Omit for the public page, where liking requires signing in */
  onToggleLike?: () => void
  likePending?: boolean
}

/** Cover mosaic, title, ownership badge, like button and playlist metadata. */
export function PlaylistHeaderCard({
  playlist,
  onEdit,
  onToggleLike,
  likePending = false
}: PlaylistHeaderCardProps) {
  return (
    <Card radius="md" p="lg" mb="xl" className={playlistStyles.playlistHeaderCard}>
      <Group align="flex-start" wrap="nowrap" gap="lg">
        {/* Playlist Cover */}
        <Box className={playlistStyles.playlistCover}>
          <div className={playlistStyles.gameIconsGrid}>
            {playlist.icons.slice(0, 4).map((icon, index) => (
              <div key={icon} className={playlistStyles.gameIconWrapper}>
                <Image
                  src={`https://media.retroachievements.org/${icon}`}
                  alt={`Game ${index + 1}`}
                  width={80}
                  height={80}
                  className={playlistStyles.gameIcon}
                />
              </div>
            ))}
          </div>
        </Box>

        {/* Playlist Info */}
        <Stack style={{ flex: 1 }} gap="sm">
          <Group justify="space-between" align="flex-start">
            <div>
              <Group gap="xs" mb="xs" align="center">
                <Title order={1} size="2rem">
                  {playlist.name}
                </Title>
                {onEdit !== undefined && (
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    size="sm"
                    onClick={onEdit}
                    title="Edit playlist details"
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                )}
              </Group>
              <Group gap="md" align="center" mb="sm">
                <Text size="lg" c="dimmed">@{playlist.createdBy}</Text>
                {playlist.isPlaylistOwner === true ? (
                  <Badge color={playlist.isPublic === true ? 'green' : 'red'} variant="light">
                    My Playlist - {playlist.isPublic === true ? 'Public' : 'Private'}
                  </Badge>
                ) : (
                  <Badge color={playlist.isPublic === true ? 'green' : 'gray'} variant="light">
                    {playlist.isPublic === true ? 'Public Playlist' : 'Private Playlist'}
                  </Badge>
                )}
              </Group>
            </div>

            <Group gap="xs">
              <Button
                leftSection={<IconHeart size={16} fill={playlist.isLiked === true ? 'currentColor' : 'none'} />}
                variant={playlist.isLiked === true ? 'filled' : 'light'}
                color="red"
                onClick={onToggleLike}
                loading={likePending}
                // Without a handler (the public page) the count is display-only
                disabled={likePending || onToggleLike === undefined}
              >
                {playlist.numberOfLikes.toLocaleString()} {playlist.isLiked === true ? 'Liked' : 'Likes'}
              </Button>
            </Group>
          </Group>

          {playlist.description.trim() !== '' && (
            <Text size="md" c="dimmed" mb="md">
              {playlist.description}
            </Text>
          )}

          <Group gap="lg">
            <Text size="sm" c="dimmed">
              <strong>{playlist.numberOfGames.toLocaleString()}</strong> games
            </Text>
            <Text size="sm" c="dimmed">
              <strong>{playlist.numberOfConsoles.toLocaleString()}</strong> consoles
            </Text>
            <Text size="sm" c="dimmed">
              Created {new Date(playlist.createdAt).toLocaleDateString()}
            </Text>
            <Text size="sm" c="dimmed">
              Updated {new Date(playlist.updatedAt).toLocaleDateString()}
            </Text>
          </Group>
        </Stack>
      </Group>
    </Card>
  )
}
