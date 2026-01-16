'use client'

import {
  Container,
  Text,
  Divider,
  Box,
  Button,
  Paper,
  Group,
  Flex,
  Accordion,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import styles from '@/css/components/gameModal.module.scss'
import pageStyles from '@/css/pages/gamePage.module.scss'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { PublicGameScreenshots } from './public/PublicGameScreenshots'
import { PublicGameStatsCards } from './public/PublicGameStatsCards'
import { PublicMainAchievementSet } from './public/PublicMainAchievementSet'
import { PublicSubsetAchievementSet } from './public/PublicSubsetAchievementSet'
import { PublicAchievementFilters } from './public/PublicAchievementFilters'
import { AchievementLeaderboardsSidebar } from './shared/AchievementLeaderboardsSidebar'

interface PublicGamePageProps {
  gameId: number
}

export function PublicGamePage(props: PublicGamePageProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { isLoading, isError, data } = useQuery({
    queryKey: ['getPublicSpecificGameInfo', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${props.gameId}`)
  })

  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)

  return (
    <Container size="100%" px="md" py="xl" className={pageStyles.pageContainer}>
      {isLoading && <Text ta="center">Loading game details...</Text>}
      {isError && <Text c="red" ta="center">Error loading game info</Text>}

      {data !== null && data !== undefined && (
        <Flex direction={isMobile ? 'column' : 'row'} gap="xl">
          <Box style={{ flex: isMobile ? 'none' : '3' }}>
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

            <Accordion variant="separated" mb="md" defaultValue="main-set">
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

            <Paper className={styles.footer} mb="xl">
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
              </Group>
            </Paper>
          </Box>

          {!isMobile && <AchievementLeaderboardsSidebar gameId={props.gameId} />}
        </Flex>
      )}
    </Container>
  )
}
