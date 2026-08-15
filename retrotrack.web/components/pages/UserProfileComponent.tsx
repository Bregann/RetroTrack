'use client'

import { Container, Grid, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse'
import { useGameModal } from '@/context/gameModalContext'
import { doQueryGet } from '@/helpers/apiClient'
import { useAuth } from '@/context/authContext'
import { useQuery } from '@tanstack/react-query'
import Loading from '@/app/loading'
import { ProfileHeaderCard } from './profile/ProfileHeaderCard'
import { ProfileStatsGrid } from './profile/ProfileStatsGrid'
import { GameWall } from './profile/GameWall'
import { ConsoleProgressBreakdown } from './profile/ConsoleProgressBreakdown'
import { RecentGamesList } from './profile/RecentGamesList'
import { useGameWallEditor } from './profile/useGameWallEditor'

interface UserProfileComponentProps {
  username: string
}

export default function UserProfileComponent(props: UserProfileComponentProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['GetUserProfile', props.username],
    queryFn: async () => await doQueryGet<GetUserProfileResponse>(`/api/users/GetUserProfile/${props.username}`, { next: { revalidate: 60 } }),
    staleTime: 60000
  })

  const isSm = useMediaQuery('(min-width: 900px)')
  const isMd = useMediaQuery('(min-width: 1200px)')
  const isLg = useMediaQuery('(min-width: 1700px)')
  const isXl = useMediaQuery('(min-width: 2440px)')

  const wallIconAmount = isXl ? 16 : isLg ? 14 : isMd ? 6 : isSm ? 5 : 4
  const statColsAmount = isLg ? 4 : isMd ? 2 : 1
  const consoleBreakdownColsAmount = isXl ? 3 : isLg ? 3 : isMd ? 2 : 1

  const gameModal = useGameModal()
  const user = useAuth()

  const wallEditor = useGameWallEditor({
    username: props.username,
    beatenWall: data?.gamesBeatenWall ?? [],
    masteredWall: data?.gamesMasteredWall ?? []
  })

  if (isLoading) {
    return (
      <Container size="100%" px="md" py="xl">
        <Loading />
      </Container>
    )
  }

  if (isError || data === undefined) {
    return (
      <Container size="100%" px="md" py="xl">
        <Text>Error loading profile data.</Text>
      </Container>
    )
  }

  return (
    <Container size="100%" px="md" py="xl">
      <ProfileHeaderCard profile={data} />

      <ProfileStatsGrid profile={data} columns={statColsAmount} />

      <Grid>
        <Grid.Col span={isMd ? 8 : 12}>
          <GameWall
            label="Beaten Games Wall"
            games={data.gamesBeatenWall}
            draft={wallEditor.drafts.beaten}
            columns={wallIconAmount}
            canEdit={user.isAuthenticated}
            isSaving={wallEditor.isSaving}
            onEdit={() => wallEditor.startEditing('beaten')}
            onCancel={() => wallEditor.cancelEditing('beaten')}
            onSave={() => { void wallEditor.save('beaten') }}
            onReorder={(event) => wallEditor.reorder('beaten', event)}
            onGameClick={gameModal.showModal}
          />

          <GameWall
            label="Completed/Mastered Games Wall"
            games={data.gamesMasteredWall}
            draft={wallEditor.drafts.mastered}
            columns={wallIconAmount}
            canEdit={user.isAuthenticated}
            isSaving={wallEditor.isSaving}
            onEdit={() => wallEditor.startEditing('mastered')}
            onCancel={() => wallEditor.cancelEditing('mastered')}
            onSave={() => { void wallEditor.save('mastered') }}
            onReorder={(event) => wallEditor.reorder('mastered', event)}
            onGameClick={gameModal.showModal}
          />

          <ConsoleProgressBreakdown
            consoleProgressData={data.consoleProgressData}
            columns={consoleBreakdownColsAmount}
          />
        </Grid.Col>

        <Grid.Col span={isMd ? 4 : 12}>
          <RecentGamesList
            label="Last 5 Played"
            games={data.last5GamesPlayed}
            onGameClick={gameModal.showModal}
          />

          <RecentGamesList
            label="Last 5 Beaten/Mastered"
            games={data.last5Awards}
            showAward
            onGameClick={gameModal.showModal}
            mt="md"
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}
