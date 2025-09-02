
import { LoggedInPlaylistPage } from '@/components/pages/playlists/LoggedInPlaylistPageComponent'
import { PublicPlaylistPage } from '@/components/pages/playlists/PublicPlaylistPageComponent'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicPlaylistDataResponse } from '@/interfaces/api/playlists/GetPublicPlaylistDataResponse'
import { GetLoggedInPlaylistDataResponse } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ playlistId: string }>
}): Promise<Metadata> {
  const { playlistId } = await params

  try {
    // Try to fetch playlist data for metadata
    const playlistData = await doQueryGet<GetPublicPlaylistDataResponse>(
      `/api/playlists/GetPublicPlaylistData?PlaylistId=${playlistId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    return {
      title: `RetroTrack - ${playlistData.name}`,
      description: `View detailed information about the "${playlistData.name}" playlist by ${playlistData.createdBy}, containing ${playlistData.numberOfGames} games on RetroTrack`,
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch {
    // Fallback metadata if playlist data fetch fails
    return {
      title: 'RetroTrack - Playlist',
      description: 'View detailed information about this gaming playlist on RetroTrack',
      icons: {
        icon: '/favicon.ico'
      }
    }
  }
}

interface PlaylistPageProps {
  params: Promise<{ playlistId: string }>
}

export default async function PlaylistPage({ params }: PlaylistPageProps) {
  const { playlistId } = await params
  const cookieStore = await cookies()
  const queryClient = new QueryClient()

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
      queryKey: [`PlaylistId=${playlistId}&SortByIndex=true&Skip=0&Take=100`],
      queryFn: async () => await doQueryGet<GetLoggedInPlaylistDataResponse>(`/api/playlists/GetLoggedInPlaylistData?PlaylistId=${playlistId}&SortByIndex=true&Skip=0&Take=100`, { cookieHeader }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <LoggedInPlaylistPage playlistId={playlistId} />
        </main>
      </HydrationBoundary>
    )
  }
  else {
    await queryClient.prefetchQuery({
      queryKey: [`PlaylistId=${playlistId}&SortByIndex=true&Skip=0&Take=100-public`],
      queryFn: async () => await doQueryGet<GetPublicPlaylistDataResponse>(`/api/playlists/GetPublicPlaylistData?PlaylistId=${playlistId}&SortByIndex=true&Skip=0&Take=100`, { next: { revalidate: 60 } }),
      staleTime: 60000
    })

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main>
          <PublicPlaylistPage playlistId={playlistId} />
        </main>
      </HydrationBoundary>
    )
  }
}
