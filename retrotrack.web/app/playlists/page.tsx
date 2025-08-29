'use client'

import { useAuth } from '@/context/authContext'
import LoggedInPlaylistsComponent from '@/components/pages/LoggedInPlaylistsComponent'
import LoggedOutPlaylistsComponent from '@/components/pages/LoggedOutPlaylistsComponent'

export default function PlaylistsPage() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <LoggedInPlaylistsComponent /> : <LoggedOutPlaylistsComponent />
}
