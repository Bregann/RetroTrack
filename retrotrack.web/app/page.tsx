import IndexComponent from '@/components/pages/IndexComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // The landing page owns the brand term, so it keeps the untemplated title
  title: {
    absolute: 'RetroTrack - RetroAchievements Achievement Tracker'
  },
  description: 'Track your RetroAchievements progress across every console. Browse games, compare achievements, view leaderboards and completion times, and build playlists - free on RetroTrack.',
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export default function Home() {
  return (
    <main>
      <IndexComponent />
    </main>
  )
}
