export const runtime = 'nodejs'

import IndexComponent from '@/components/pages/IndexComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetroTrack - Home',
  description: 'RetroTrack is an feature full achievement tracker for RetroAchievements!',
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
