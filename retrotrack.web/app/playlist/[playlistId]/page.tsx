
import { LoggedInPlaylistPage } from '@/components/pages/LoggedInPlaylistPageComponent'
import { PublicPlaylistPage } from '@/components/pages/PublicPlaylistPageComponent'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ playlistId: string }>
}): Promise<Metadata> {
  const { playlistId } = await params

  try {
    // TODO: Fetch playlist data for metadata when API is available
    return {
      title: `RetroTrack - Playlist`,
      description: `View detailed information about this gaming playlist on RetroTrack`,
      icons: {
        icon: '/favicon.ico'
      }
    }
  } catch (error) {
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
  const sessionCookie = cookieStore.get('accessToken')
  const isAuthenticated = sessionCookie?.value !== undefined

  const playlistIdNum = parseInt(playlistId, 10)

  if (isNaN(playlistIdNum)) {
    throw new Error('Invalid playlist ID')
  }

  return (
    <>
      {isAuthenticated ? (
        <LoggedInPlaylistPage playlistId={playlistIdNum} />
      ) : (
        <PublicPlaylistPage playlistId={playlistIdNum} />
      )}
    </>
  )
}
