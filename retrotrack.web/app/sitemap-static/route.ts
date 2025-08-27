import { doGet } from '@/helpers/apiClient'

export async function GET(): Promise<Response> {
  try {
    const staticUrls = [
      {
        url: 'https://retrotrack.bregan.me/',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: 'https://retrotrack.bregan.me/home',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: 'https://retrotrack.bregan.me/console/allgames',
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.9'
      }
    ]

    // Add console URLs
    const consoleData = await doGet<number[]>('/api/sitemap/GetConsoleIds')
    if (consoleData.ok && consoleData.data !== undefined) {
      const consoleUrls = consoleData.data.map((consoleId) => ({
        url: `https://retrotrack.bregan.me/console/${consoleId}`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '0.8'
      }))
      staticUrls.push(...consoleUrls)
    }

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${staticUrls.map((url) => `
        <url>
          <loc>${url.url}</loc>
          <lastmod>${url.lastmod}</lastmod>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `).join('')}
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
