import { SimpleGrid, Box, Image } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import styles from '@/css/components/gameModal.module.scss'

interface PublicGameScreenshotsProps {
  gameId: number
  isSmall: boolean
}

export function PublicGameScreenshots({ gameId, isSmall }: PublicGameScreenshotsProps) {
  const { data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`)
  })

  if (!data) return null

  return (
    <SimpleGrid cols={isSmall ? 1 : 3} mb="md">
      <Image
        src={`https://media.retroachievements.org${data.imageInGame}`}
        alt="In-Game Screenshot"
        radius="sm"
        className={styles.gameScreenshot}
      />
      <Image
        src={`https://media.retroachievements.org${data.imageTitle}`}
        alt="Title Screen"
        radius="sm"
        className={styles.gameScreenshot}
      />
      <Box className={styles.gameCoverBox}>
        <Image
          src={`https://media.retroachievements.org${data.imageBoxArt}`}
          alt="Box Art"
          radius="sm"
          className={styles.gameCoverArt}
        />
      </Box>
    </SimpleGrid>
  )
}
