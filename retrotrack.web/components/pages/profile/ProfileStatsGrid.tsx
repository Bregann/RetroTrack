'use client'

import { SimpleGrid } from '@mantine/core'
import { IconCrown, IconMedal, IconPercentage, IconTrophy } from '@tabler/icons-react'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { ProfileStatCard } from './ProfileStatCard'

interface ProfileStatsGridProps {
  profile: GetUserProfileResponse
  columns: number
}

/**
 * The four headline figures.
 *
 * Each prefers the hardcore count and falls back to the casual one, matching how
 * the rest of the site treats hardcore as the headline achievement.
 */
export function ProfileStatsGrid({ profile, columns }: ProfileStatsGridProps) {
  return (
    <SimpleGrid cols={columns} mb="xl" spacing="md">
      <ProfileStatCard
        label="Games Beaten"
        icon={<IconTrophy size={14} color="orange" />}
        value={profile.gamesBeatenHardcore !== 0 ? profile.gamesBeatenHardcore : profile.gamesBeatenSoftcore}
        colour="orange"
      />
      <ProfileStatCard
        label="Games Completed/Mastered"
        icon={<IconCrown size={14} color="gold" />}
        value={profile.gamesMastered !== 0 ? profile.gamesMastered : profile.gamesCompleted}
        colour="gold"
      />
      <ProfileStatCard
        label="Achievements Unlocked"
        icon={<IconMedal size={14} color="blue" />}
        value={profile.achievementsEarnedHardcore !== 0 ? profile.achievementsEarnedHardcore : profile.achievementsEarnedSoftcore}
        colour="blue"
      />
      <ProfileStatCard
        label="In Progress Games"
        icon={<IconPercentage size={14} color="orange" />}
        value={profile.gamesInProgress}
        colour="orange"
      />
    </SimpleGrid>
  )
}
