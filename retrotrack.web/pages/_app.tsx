import '../styles/global.css'
import '@mantine/core/styles.css'
import 'mantine-datatable/styles.css'
import '@mantine/notifications/styles.css'
import { MantineProvider } from '@mantine/core'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Navigation from '@/components/navigation/navigation'
import { Notifications } from '@mantine/notifications'

export default function App (props: AppProps): JSX.Element {
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  return (
    <>
      <Head>
        <title>RetroTrack</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="RetroTrack" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://retrotrack.bregan.me" />
        <meta property="og:image" content="/rt.png" />
        <meta property="og:description" content="Achievement tracking website for RetroAchievements" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="description" content="RetroTrack is a Tracker for the website RetroAchievements. This Retro Achievement tracking site allows for you to track games, see your inprogress games, see newly added games plus more. New RetroAchievement consoles are added quickly and the site is updated daily." />
      </Head >

      <MantineProvider defaultColorScheme="dark">
        <Navigation {...props} />
        <Notifications />
      </MantineProvider>
    </>
  )
}
