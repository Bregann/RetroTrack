import { Group, Button, Text, Title, Box } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import Image from 'next/image'
import styles from '@/css/components/gameModal.module.scss'

interface GameHeaderProps {
  gameId: number
}

export function GameHeader({ gameId }: GameHeaderProps) {
  const router = useRouter()

  const { isLoading, isError, data } = useQuery({
    queryKey: ['getGameInfoForUser', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`)
  })

  return (
    <Group mb="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
      >
        Back
      </Button>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text c="red">Error loading game info</Text>
      ) : data !== null && data !== undefined ? (
        <Group gap="md" align="center" style={{ flexWrap: 'nowrap' }}>
          <Box className={styles.iconBox}>
            <Image
              src={`https://media.retroachievements.org${data.gameImage}`}
              alt="Game Icon"
              width={64}
              height={64}
              style={{ borderRadius: '4px' }}
              className={styles.gameIcon}
            />
          </Box>
          <Title order={1} size="2rem">
            {data.title}
          </Title>
        </Group>
      ) : null}
    </Group>
  )
}
