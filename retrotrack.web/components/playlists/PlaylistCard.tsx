import { useRouter } from 'next/navigation'
import styles from '@/css/pages/playlists.module.scss'
import { Card, Group, Stack, Text } from '@mantine/core'
import Image from 'next/image'
import { IconHeart } from '@tabler/icons-react'

interface PlaylistCardProps {
  id: string
  title: string
  username: string
  likes: number
  isPublic: boolean
  gameIcons: string[]
  createdAt: string
  updatedAt: string
  description: string
}

export function PlaylistCard(props: PlaylistCardProps) {
  const router = useRouter()

  return (
    <Card
      className={styles.playlistCard}
      radius="md"
      p={0}
      style={{ cursor: 'pointer' }}
      onClick={() => router.push(`/playlist/${props.id}`)}
    >
      <div className={styles.playlistImageContainer}>
        <div className={styles.gameIconsGrid}>
          {props.gameIcons.slice(0, 4).map((icon, index) => (
            <div key={index} className={styles.gameIconWrapper}>
              <Image
                src={`https://media.retroachievements.org/${icon}`}
                alt={`Game ${index + 1}`}
                width={96}
                height={96}
                className={styles.gameIcon}
              />
            </div>
          ))}
        </div>
      </div>

      <Stack p="md" gap="xs">
        <Text size="lg" fw={600} lineClamp={2} className={styles.playlistTitle}>
          {props.title}
        </Text>

        {props.description !== null && props.description !== undefined && props.description.trim() !== '' && (
          <Text size="sm" c="dimmed" lineClamp={2}>
            {props.description}
          </Text>
        )}

        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            @{props.username}
          </Text>

          <Group gap="xs" align="center">
            <IconHeart size={16} className={styles.heartIcon} />
            <Text size="sm" c="dimmed">
              {props.likes} likes
            </Text>
          </Group>
        </Group>

        <Group justify="space-between" align="center">
          <Text size="xs" c="dimmed">
            Created {new Date(props.createdAt).toLocaleDateString()}
          </Text>
          <Text size="xs" c="dimmed">
            Updated {new Date(props.updatedAt).toLocaleDateString()}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
}
