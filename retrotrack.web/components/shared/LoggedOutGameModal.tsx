'use client'

import {
  Modal,
  Group,
  Text,
  Image,
  Button,
  Divider,
  Box,
  Paper,
  Accordion,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import styles from '@/css/components/gameModal.module.scss'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import Link from 'next/link'
import { PublicGameScreenshots } from '../pages/games/public/PublicGameScreenshots'
import { PublicGameStatsCards } from '../pages/games/public/PublicGameStatsCards'
import { PublicAchievementFilters } from '../pages/games/public/PublicAchievementFilters'
import { PublicMainAchievementSet } from '../pages/games/public/PublicMainAchievementSet'
import { PublicSubsetAchievementSet } from '../pages/games/public/PublicSubsetAchievementSet'

interface LoggedOutGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedOutGameModal(props: LoggedOutGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const { isLoading, isError, data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${props.gameId}`)
  })

  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)

  return (
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="sm"
      radius="sm"
      title={
        // If gameQuery is loading, show a loading state
        isLoading ? (
          <Text>Loading...</Text>
        ) : isError ? (
          <Text c="red">Error loading game info</Text>
        ) : (
          <Group gap="md" align="center" justify="center" style={{ flexWrap: 'nowrap' }}>
            <Box className={styles.iconBox}>
              <Image
                src={`https://media.retroachievements.org${data?.gameImage}`}
                alt="Game Icon"
                width={64}
                height={64}
                radius="sm"
                className={styles.gameIcon}
              />
            </Box>
            <Text size="xl" fw={700}>
              {data?.title}
            </Text>
          </Group>
        )
      }
    >
      {isLoading && <Text>Loading game details...</Text>}
      {isError && <Text c="red">Error loading game info</Text>}

      {data !== undefined && (
        <>
          <PublicGameScreenshots gameId={props.gameId} isSmall={isSmall} />

          <Divider my="sm" label="Summary" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

          <PublicGameStatsCards gameId={props.gameId} />

          <Divider my="sm" label="Sets & Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

          <PublicAchievementFilters
            showProgressionOnly={showProgressionOnly}
            onShowProgressionOnlyChange={setShowProgressionOnly}
            showMissableOnly={showMissableOnly}
            onShowMissableOnlyChange={setShowMissableOnly}
          />

          <Accordion variant="separated" mb="md" mt="sm" defaultValue="main-set">
            <PublicMainAchievementSet
              gameId={props.gameId}
              isSmall={isSmall}
              showProgressionOnly={showProgressionOnly}
              showMissableOnly={showMissableOnly}
            />

            {data.subsets && data.subsets.length > 0 && data.subsets.map((subset) => (
              <PublicSubsetAchievementSet
                key={subset.gameId}
                subset={subset}
                isSmall={isSmall}
                showProgressionOnly={showProgressionOnly}
                showMissableOnly={showMissableOnly}
              />
            ))}
          </Accordion>

          <Paper className={styles.footer}>
            <Group justify="apart">
              <Button
                component="a"
                variant="gradient"
                gradient={{ from: 'indigo', to: 'cyan' }}
                target="_blank"
                href={'https://retroachievements.org/game/' + data.gameId}
              >
                RetroAchievements Page
              </Button>
              <Button
                component={Link}
                variant="gradient"
                gradient={{ from: 'teal', to: 'lime', deg: 105 }}
                href={'/game/' + data.gameId.toString()}
                onClick={() => props.onClose()}
              >
                RetroTrack Page
              </Button>
            </Group>
          </Paper>
        </>
      )}
    </Modal >
  )
}
