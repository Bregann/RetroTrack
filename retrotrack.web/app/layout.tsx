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
  if(cookieStore.has('accessToken')) {
    const result = await doGet<GetLoggedInNavigationDataResponse>('/api/navigation/GetLoggedInNavigationData')
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
        <ColorSchemeScript />
      </head>
      <body style={{ marginBottom: 20 }}>
        <Providers>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
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
