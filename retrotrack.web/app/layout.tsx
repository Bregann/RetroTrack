export const runtime = 'nodejs'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import { AuthProvider } from '@/context/authContext'
import { Navbar } from '@/components/navigation/Navbar'
import Providers from './providers'
import { cookies } from 'next/headers'
import { doGet } from '@/helpers/apiClient'
import { GetPublicNavigationDataResponse } from '@/interfaces/api/navigation/GetPublicNavigationDataResponse'
import { GameModalProvider } from '@/context/gameModalContext'
import { GetLoggedInNavigationDataResponse } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse'
import { Notifications } from '@mantine/notifications'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetroTrack',
  description: 'RetroTrack is a feature-rich achievement tracker for RetroAchievements!',
  icons: {
    icon: '/favicon.ico'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

//override the background colour for mantine dark mode
const theme = createTheme({
  colors: {
    dark: [
      '#F3F4F6',
      '#DFE2E6',
      '#C3C7CD',
      '#9BA1A9',
      '#6E757E',
      '#4A4F57',
      '#2F333B',
      '#23272E',
      '#1D2026',
      '#15171C'
    ]
  }
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const cookieStore = await cookies()
  let data: GetPublicNavigationDataResponse[] | null = null
  let loggedInData: GetLoggedInNavigationDataResponse | null = null

  // get the navigation data depending on whether the user is logged in or not
  // if the user is logged in, we will get the navigation data for the logged in user
  if (cookieStore.has('accessToken')) {

    // As it is a server-side request, we need to pass the cookies manually
    // because Next.js does not automatically forward cookies in server-side requests
    // server side to server side requests do not have access to the cookies directly
    const cookieHeader = cookieStore
      .getAll()
      .map(c => `${c.name}=${c.value}`)
      .join('; ')

    const result = await doGet<GetLoggedInNavigationDataResponse>('/api/navigation/GetLoggedInNavigationData', { cookieHeader })

    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load logged in navigation data:', result.status)
      loggedInData = null
    } else {
      loggedInData = result.data
    }
  } else {

    const result = await doGet<GetPublicNavigationDataResponse[]>('/api/navigation/GetPublicNavigationData')
    if (result.status !== 200 || result.data === undefined) {
      console.error('Failed to load public navigation data:', result.status)
      data = null
    }
    else {
      data = result.data
    }
  }

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <ColorSchemeScript />
      </head>
      <body style={{ marginBottom: 20 }}>
        <Providers>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
            <Notifications />
            <AuthProvider>
              <GameModalProvider>
                <Navbar publicNavigationData={data} loggedInNavigationData={loggedInData}>{children}</Navbar>
              </GameModalProvider>
            </AuthProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}
