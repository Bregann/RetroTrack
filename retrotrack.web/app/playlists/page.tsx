import LoggedInPlaylistsComponent from '@/components/pages/playlists/LoggedInPlaylistsComponent'
import LoggedOutPlaylistsComponent from '@/components/pages/playlists/PublicPlaylistsComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPlaylistResponse } from '@/interfaces/api/playlists/GetPlaylistResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'RetroTrack - Playlists',
    description: 'Discover and manage game playlists on RetroTrack. Create custom playlists, explore community playlists, and track your gaming progress.',
    icons: {
      icon: '/favicon.ico'
    }
  }
}

export default async function PlaylistsPage() {
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

  // Prefetch public playlists - used for both logged out and in
  await queryClient.prefetchQuery({
    queryKey: ['getPublicPlaylists'],
    queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetPublicPlaylists', { next: { revalidate: 60 } }),
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
      queryKey: ['getUserPlaylists'],
      queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetUserPlaylists', { cookieHeader }),
      staleTime: 60000
    })

    await queryClient.prefetchQuery({
      queryKey: ['getUserLikedPlaylists'],
      queryFn: async () => await doQueryGet<GetPlaylistResponse>('/api/playlists/GetUserLikedPlaylists', { cookieHeader }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <LoggedInPlaylistsComponent />
        </main>
      </HydrationBoundary>
    )
  }
  else {
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <LoggedOutPlaylistsComponent />
        </main>
      </HydrationBoundary>
    )
  }
}
