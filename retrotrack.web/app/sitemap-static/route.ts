import { doGet } from '@/helpers/apiClient'
import { GetPlaylistResponse } from '@/interfaces/api/playlists/GetPlaylistResponse'
import { absoluteUrl } from '@/helpers/seo'

export const revalidate = 3600 // revalidate every hour

interface SitemapUrl {
  url: string
  lastmod: string
  changefreq: string
  priority: string
}

/** Escapes the five XML entities so a stray & in a URL cannot break the document */
const escapeXml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export async function GET(): Promise<Response> {
  try {
    const now = new Date().toISOString()

    const staticUrls: SitemapUrl[] = [
      {
        url: absoluteUrl('/'),
        lastmod: now,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: absoluteUrl('/home'),
        lastmod: now,
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: absoluteUrl('/console/allgames'),
        lastmod: now,
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: absoluteUrl('/search'),
        lastmod: now,
        changefreq: 'weekly',
        priority: '0.7'
      },
      {
        url: absoluteUrl('/playlists'),
        lastmod: now,
        changefreq: 'daily',
        priority: '0.8'
      }
    ]

    // Add console URLs
    const consoleData = await doGet<number[]>('/api/sitemap/GetConsoleIds')
    if (consoleData.ok && consoleData.data !== undefined) {
      const consoleUrls = consoleData.data.map((consoleId) => ({
        url: absoluteUrl(`/console/${consoleId}`),
        lastmod: now,
        changefreq: 'daily',
        priority: '0.8'
      }))
      staticUrls.push(...consoleUrls)
    }

    // Add public playlist URLs - these were previously missing from every sitemap,
    // so search engines had no way to discover them by crawling
    try {
      const playlistData = await doGet<GetPlaylistResponse>('/api/playlists/GetPublicPlaylists')
      if (playlistData.ok && playlistData.data !== undefined) {
        const playlistUrls = playlistData.data.playlists
          .filter((playlist) => playlist.isPublic)
          .map((playlist) => ({
            url: absoluteUrl(`/playlist/${playlist.id}`),
            lastmod: new Date(playlist.updatedAt).toISOString(),
            changefreq: 'weekly',
            priority: '0.6'
          }))
        staticUrls.push(...playlistUrls)
      }
    } catch (error) {
      // A playlist failure should not take down the whole sitemap
      console.error('Failed to fetch playlists for sitemap:', error)
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
  staticUrls.map((entry) => `
  <url>
    <loc>${escapeXml(entry.url)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('')
}
</urlset>`

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
        'x-content-type-options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Failed to generate static sitemap:', error)
    return new Response('', { status: 500 })
  }
}
