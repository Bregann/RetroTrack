import { PublicGamePage } from '@/components/pages/PublicGamePageComponent'
import { LoggedInGamePage } from '@/components/pages/LoggedInGamePageComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { GetLeaderboardsFromGameIdResponse } from '@/interfaces/api/games/GetLeaderboardsFromGameIdResponse'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ gameId: string }>
}): Promise<Metadata> {
  const { gameId } = await params

  try {
    // Try to fetch game data for metadata
    const gameData = await doQueryGet<GetPublicSpecificGameInfoResponse>(
      `/api/games/getPublicSpecificGameInfo/${gameId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    return {
      title: `RetroTrack - ${gameData.title}`,
      description: `View detailed information about ${gameData.title} for ${gameData.consoleName}, including achievements and leaderboards on RetroTrack`,
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch {
    // Fallback metadata if game data fetch fails
    return {
      title: 'RetroTrack - Game Details',
      description: 'View detailed information about a specific game including achievements and leaderboard',
      icons: {
        icon: '/favicon.ico'
      }
    }
  }
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ gameId: string }>
}) {
  const { gameId } = await params
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

    // prefetch achievement leaderboards - used for both logged out and in
    await queryClient.prefetchQuery({
      queryKey: ['getAchievementLeaderboards', parseInt(gameId, 10)],
      queryFn: async () => await doQueryGet<GetLeaderboardsFromGameIdResponse>(`/api/games/GetLeaderboardsFromGameId/${gameId}`, { next: { revalidate: 60 } }),
      staleTime: 60000
    })

  // Check if the user is logged in by checking for the accessToken cookie
  if (cookieStore.has('accessToken')) {
    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    await queryClient.prefetchQuery({
      queryKey: ['getGameInfoForUser', parseInt(gameId, 10)],
      queryFn: async () => await doQueryGet<GetLoggedInSpecificGameInfoResponse>(`/api/games/GetGameInfoForUser/${gameId}`, { cookieHeader }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <LoggedInGamePage gameId={parseInt(gameId, 10)} />
        </main>
      </HydrationBoundary>
    )
  }
  else {
    await queryClient.prefetchQuery({
      queryKey: ['getPublicSpecificGameInfo', parseInt(gameId, 10)],
      queryFn: async () => await doQueryGet<GetPublicSpecificGameInfoResponse>(`/api/games/getPublicSpecificGameInfo/${gameId}`, { next: { revalidate: 60 } }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <PublicGamePage gameId={parseInt(gameId, 10)} />
        </main>
      </HydrationBoundary>
    )
  }
}
