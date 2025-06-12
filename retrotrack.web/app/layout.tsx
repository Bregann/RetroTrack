import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import { Navbar } from '@/components/navigation/Navbar'
import FloatingButtons from '@/components/navigation/FloatingButtons'
import { AuthProvider } from '@/context/authContext'

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
          <AuthProvider>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              <Navbar />
              <div style={{ flex: 1, padding: 'var(--mantine-spacing-md)' }}>
                <FloatingButtons />
                {children}
              </div>
            </div>
          </AuthProvider>
        </MantineProvider>

      </body>
    </html>
  )
}
