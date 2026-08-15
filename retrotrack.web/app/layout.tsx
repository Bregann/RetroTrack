import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { ColorSchemeScript, MantineProvider, createTheme, mantineHtmlProps } from '@mantine/core'
import { AuthProvider } from '@/context/authContext'
import { Navbar } from '@/components/navigation/Navbar'
import Providers from './providers'
import { GameModalProvider } from '@/context/gameModalContext'
import { NavigationDataBoundary } from '@/components/navigation/NavigationDataBoundary'
import { Notifications } from '@mantine/notifications'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { absoluteUrl, jsonLdScript, SITE_NAME, SITE_URL } from '@/helpers/seo'

const siteDescription = 'RetroTrack is a feature-rich achievement tracker for RetroAchievements. Track your progress, compare achievements, browse every console and build game playlists.'

export const metadata: Metadata = {
  // Required so that Next.js can resolve relative canonical and Open Graph URLs
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RetroTrack - RetroAchievements Achievement Tracker',
    // Child pages set a plain title and get the brand appended automatically
    template: `%s | ${SITE_NAME}`
  },
  description: siteDescription,
  applicationName: SITE_NAME,
  keywords: [
    'RetroAchievements',
    'achievement tracker',
    'retro gaming',
    'retro achievements tracker',
    'game completion tracker',
    'RetroTrack'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    url: absoluteUrl('/'),
    title: 'RetroTrack - RetroAchievements Achievement Tracker',
    description: siteDescription,
    locale: 'en_GB'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RetroTrack - RetroAchievements Achievement Tracker',
    description: siteDescription
  },
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

// Site-wide structured data. WebSite + SearchAction lets Google render a
// sitelinks search box, and Organisation ties the brand together.
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: absoluteUrl('/'),
      name: SITE_NAME,
      description: siteDescription,
      inLanguage: 'en-GB',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?query={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#webapp`,
      name: SITE_NAME,
      url: absoluteUrl('/'),
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any',
      description: siteDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP'
      }
    }
  ]
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

// Not async: the layout must not await anything, or it blocks the first byte
// for every route. The navigation prefetch streams in via Suspense below.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <ColorSchemeScript />
        {/* Speeds up the first game/console image paint, which feeds Core Web Vitals */}
        <link rel="preconnect" href="https://media.retroachievements.org" />
        <link rel="dns-prefetch" href="https://media.retroachievements.org" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd) }}
        />
      </head>
      <body style={{ marginBottom: 20 }}>
        <Providers>
          <MantineProvider defaultColorScheme="auto" theme={theme}>
            <Notifications zIndex={9999} />
            <AuthProvider>
              <GameModalProvider>
                {/* Streams the prefetched nav data into the client cache without
                    holding up the shell. The Navbar renders straight away and
                    shows its own loading state until this resolves. */}
                <Suspense fallback={null}>
                  <NavigationDataBoundary />
                </Suspense>
                <Navbar>{children}</Navbar>
              </GameModalProvider>
            </AuthProvider>
          </MantineProvider>
        </Providers>
      </body>
    </html>
  )
}
