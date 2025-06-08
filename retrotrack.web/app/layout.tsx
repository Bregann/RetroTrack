import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps, virtualColor } from '@mantine/core'
import { Navbar } from '@/components/navigation/Navbar'
import FloatingButtons from '@/components/navigation/FloatingButtons'

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully',
}

//override the background colour for mantine dark mode
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
        <MantineProvider defaultColorScheme="auto">
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ flex: 1, padding: 'var(--mantine-spacing-md)' }}>
              <FloatingButtons />
              {children}
            </div>
          </div>
        </MantineProvider>

      </body>
    </html>
  )
}
