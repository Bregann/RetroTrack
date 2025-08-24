import HomeComponent from '@/components/pages/HomeComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetRecentlyAddedAndUpdatedGamesResponse } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetroTrack - Home',
  description: 'RetroTrack is a feature-rich achievement tracker for RetroAchievements!',
  icons: {
    icon: '/favicon.ico'
  }
}

export default async function Home() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['recentlyAddedAndUpdatedGames'],
    queryFn: async () => await doQueryGet<GetRecentlyAddedAndUpdatedGamesResponse>('/api/games/GetRecentlyAddedAndUpdatedGames'),
    staleTime: 60000
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeComponent />
    </HydrationBoundary>
  )
}
