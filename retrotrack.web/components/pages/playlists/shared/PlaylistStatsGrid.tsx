'use client'

import { SimpleGrid } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconMedal, IconPlayerPlay, IconTrophy } from '@tabler/icons-react'
import { GetLoggedInPlaylistDataResponse } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import { PlaylistStatCard } from './PlaylistStatCard'

interface PlaylistStatsGridProps {
  playlist: GetLoggedInPlaylistDataResponse
}

/** The four progress tiles above a playlist's game table. */
export function PlaylistStatsGrid({ playlist }: PlaylistStatsGridProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <SimpleGrid cols={isMobile ? 2 : 4} mb="xl" spacing="md">
      <PlaylistStatCard
        label="Beaten"
        icon={<IconPlayerPlay size={16} color="orange" />}
        value={playlist.totalGamesBeatenHardcore + playlist.totalGamesBeatenSoftcore}
        total={playlist.totalGamesInPlaylist}
        percentage={playlist.percentageBeaten}
        progressColour="orange"
        hardcore={playlist.totalGamesBeatenHardcore}
        softcore={playlist.totalGamesBeatenSoftcore}
      />

      <PlaylistStatCard
        label="Completed / Mastered"
        icon={<IconMedal size={16} color="blue" />}
        value={playlist.totalGamesCompletedSoftcore + playlist.totalGamesMasteredHardcore}
        total={playlist.totalGamesInPlaylist}
        percentage={playlist.percentageMastered}
        progressColour="blue"
        hardcore={playlist.totalGamesMasteredHardcore}
        softcore={playlist.totalGamesCompletedSoftcore}
      />

      <PlaylistStatCard
        label="Points"
        icon={<IconTrophy size={16} color="orange" />}
        value={playlist.totalPointsToEarn}
      />

      <PlaylistStatCard
        label="Achievements"
        icon={<IconMedal size={16} color="blue" />}
        value={Math.max(
          playlist.totalAchievementsEarnedSoftcore,
          playlist.totalAchievementsEarnedHardcore
        )}
        total={playlist.totalAchievementsToEarn}
        percentage={playlist.percentageAchievementsGained}
        progressColour="green"
        hardcore={playlist.totalAchievementsEarnedHardcore}
        softcore={playlist.totalAchievementsEarnedSoftcore}
      />
    </SimpleGrid>
  )
}
