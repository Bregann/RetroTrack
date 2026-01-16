'use client'

import {
  Modal,
  Group,
  Text,
  Image,
  Button,
  Divider,
  Box,
  Accordion,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconCheck } from '@tabler/icons-react'
import styles from '@/css/components/gameModal.module.scss'
import { useEffect, useRef, useState } from 'react'
import notificationHelper from '@/helpers/notificationHelper'
import { useQuery } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { GameScreenshots } from '../pages/games/shared/GameScreenshots'
import { GameStatsCards } from '../pages/games/logged-in/GameStatsCards'
import { MainAchievementSet } from '../pages/games/logged-in/MainAchievementSet'
import { SubsetAchievementSet } from '../pages/games/logged-in/SubsetAchievementSet'
import { GameModalFooter } from '../pages/games/logged-in/GameModalFooter'

interface LoggedInGameModalProps {
  gameId: number
  onClose: () => void
}

export function LoggedInGameModal(props: LoggedInGameModalProps) {
  const isSmall = useMediaQuery('(max-width: 1100px)')

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
    <Modal
      opened={props.gameId !== undefined}
      onClose={() => props.onClose()}
      size={'75%'}
      padding="sm"
      radius="sm"
      title={
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

          <GameModalFooter
            gameId={props.gameId}
            disabled={disabled}
            autoUpdateChecked={autoUpdateChecked}
            onAutoUpdateChange={setAutoUpdateChecked}
            onUpdateGame={handleGameUpdate}
            onClose={props.onClose}
          />
        </>
      )}
    </Modal>
  )
}
