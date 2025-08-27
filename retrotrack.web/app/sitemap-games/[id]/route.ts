import { doGet } from '@/helpers/apiClient'
import { GetGameIdsResponse } from '@/interfaces/sitemap/GetGameIdsResponse'

const URLS_PER_SITEMAP = 45000

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const chunkIndex = parseInt(params.id, 10)

  try {
    const gameData = await doGet<GetGameIdsResponse[]>('/api/sitemap/GetGameIds')
    if (!gameData.ok || gameData.data === undefined) {
      return new Response('', { status: 404 })
    }

    const start = chunkIndex * URLS_PER_SITEMAP
    const end = start + URLS_PER_SITEMAP
    const gamesForThisSitemap = gameData.data.slice(start, end)

    // Pre-process the data to avoid doing date operations in template literal
    const urlEntries = gamesForThisSitemap.map((game) => ({
      loc: `https://retrotrack.bregan.me/game/${game.id}`,
      lastmod: new Date(game.lastUpdated ?? Date.now()).toISOString(),
      changefreq: 'daily',
      priority: '0.7'
    }))

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
      urlEntries.map(entry => `
        <url>
          <loc>${entry.loc}</loc>
          <lastmod>${entry.lastmod}</lastmod>
          <changefreq>${entry.changefreq}</changefreq>
          <priority>${entry.priority}</priority>
        </url>`).join('')
    }
    </urlset>`.trim()

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
        'x-content-type-options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Failed to fetch game IDs for sitemap:', error)
    return new Response('', { status: 500 })
  }
}
