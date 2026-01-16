'use client'

import { Container, Text, Divider, Accordion, Button, Group, Box, Flex } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import notificationHelper from '@/helpers/notificationHelper'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import pageStyles from '@/css/pages/gamePage.module.scss'
import { GameHeader } from './logged-in/GameHeader'
import { GameScreenshots } from './shared/GameScreenshots'
import { GameStatsCards } from './logged-in/GameStatsCards'
import { MainAchievementSet } from './logged-in/MainAchievementSet'
import { SubsetAchievementSet } from './logged-in/SubsetAchievementSet'
import { GameFooter } from './logged-in/GameFooter'
import { AchievementLeaderboardsSidebar } from './shared/AchievementLeaderboardsSidebar'

interface LoggedInGamePageProps {
  gameId: number
}

export function LoggedInGamePage(props: LoggedInGamePageProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')
  const isMobile = useMediaQuery('(max-width: 768px)')

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ['getGameInfoForUser', props.gameId],
    refetchOnMount: true,
    queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${props.gameId}`)
  })

  const [hideUnlockedAchievements, setHideUnlockedAchievements] = useState(false)
  const [showProgressionOnly, setShowProgressionOnly] = useState(false)
  const [showMissableOnly, setShowMissableOnly] = useState(false)
  const [autoUpdateChecked, setAutoUpdateChecked] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const gameAutoUpdateTimerRef = useRef<NodeJS.Timeout | null>(null)
  const gameUpdateButtonTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleGameUpdate = async () => {
    setDisabled(true)
    await refetch()
    notificationHelper.showSuccessNotification('Game Updated', 'Game information has been updated', 3000, <IconCheck />)
    gameUpdateButtonTimerRef.current = setTimeout(() => {
      setDisabled(false)
    }, 30000)
  }

  useEffect(() => {
    return () => {
      if (gameUpdateButtonTimerRef.current !== null) {
        clearTimeout(gameUpdateButtonTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (autoUpdateChecked) {
      notificationHelper.showSuccessNotification('Enabled', 'Achievement auto updates enabled', 3000, <IconCheck />)
      gameAutoUpdateTimerRef.current = setInterval(async () => {
        await refetch()
      }, 60000)
    }
    if (!autoUpdateChecked && gameAutoUpdateTimerRef.current !== null) {
      clearInterval(gameAutoUpdateTimerRef.current)
      gameAutoUpdateTimerRef.current = null
      notificationHelper.showSuccessNotification('Disabled', 'Achievement auto updates disabled', 3000, <IconCheck />)
    }
  }, [autoUpdateChecked, refetch])

  return (
    <Container size="100%" px="md" py="xl" className={pageStyles.pageContainer}>
      <GameHeader gameId={props.gameId} />

      {isLoading && <Text ta="center">Loading game details...</Text>}
      {isError && <Text c="red" ta="center">Error loading game info</Text>}

      {data !== null && data !== undefined && (
        <Flex direction={isMobile ? 'column' : 'row'} gap="xl">
          {/* Left Content - Game Details and Achievements */}
          <Box style={{ flex: isMobile ? 'none' : '3' }}>
            <GameScreenshots gameId={props.gameId} isSmall={isSmall} />

            <Divider my="sm" label="Summary" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

            <GameStatsCards gameId={props.gameId} />

            <Divider my="sm" label="Sets & Achievements" labelPosition="center" styles={{ label: { fontSize: 15 } }} />

            <Accordion variant="separated" mb="md" defaultValue="main-set">
              <MainAchievementSet
                gameId={props.gameId}
                isSmall={isSmall}
                hideUnlocked={hideUnlockedAchievements}
                showProgressionOnly={showProgressionOnly}
                showMissableOnly={showMissableOnly}
                onHideUnlockedChange={setHideUnlockedAchievements}
                onShowProgressionOnlyChange={setShowProgressionOnly}
                onShowMissableOnlyChange={setShowMissableOnly}
              />

              {data.subsets && data.subsets.length > 0 && data.subsets.map((subset) => (
                <SubsetAchievementSet
                  key={subset.gameId}
                  subset={subset}
                  isSmall={isSmall}
                  hideUnlocked={hideUnlockedAchievements}
                  showProgressionOnly={showProgressionOnly}
                  showMissableOnly={showMissableOnly}
                  onUpdateGame={handleGameUpdate}
                />
              ))}
            </Accordion>

            {data.subsets && data.subsets.length > 0 && (
              <Group justify="center" mb="md">
                <Button
                  size="lg"
                  variant="filled"
                  color="green"
                  onClick={handleGameUpdate}
                >
                  Update All Sets
                </Button>
              </Group>
            )}

            <GameFooter
              gameId={props.gameId}
              disabled={disabled}
              autoUpdateChecked={autoUpdateChecked}
              onAutoUpdateChange={setAutoUpdateChecked}
              onUpdateGame={handleGameUpdate}
            />
          </Box>

          {/* Right Sidebar - Achievement Leaderboards */}
          {!isMobile && <AchievementLeaderboardsSidebar gameId={props.gameId} />}
        </Flex>
      )}
    </Container>
  )
}
