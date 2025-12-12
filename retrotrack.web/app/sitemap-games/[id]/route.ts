import { NextRequest } from 'next/server'
import { doGet } from '@/helpers/apiClient'
import { GetGameIdsResponse } from '@/interfaces/sitemap/GetGameIdsResponse'

const URLS_PER_SITEMAP = 45000

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // revalidate every hour

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params // Await the params Promise
    const gameData = await doGet<GetGameIdsResponse[]>('/api/sitemap/GetGameIds')
    if (!gameData.ok || gameData.data === undefined) {
      return new Response('Not found', { status: 404 })
    }

    const chunkIndex = parseInt(id, 10)
    // It's good practice to check if the parsing resulted in a valid number
    if (isNaN(chunkIndex)) {
      return new Response('Invalid sitemap index', { status: 400 })
    }

    const start = chunkIndex * URLS_PER_SITEMAP
    const end = start + URLS_PER_SITEMAP
    const gamesForThisSitemap = gameData.data.slice(start, end)

    if (gamesForThisSitemap.length === 0) {
      return new Response('Not found', { status: 404 })
    }

    // Pre-process the data to avoid doing date operations in template literal
    const urlEntries = gamesForThisSitemap.map((game) => ({
      loc: `https://retrotrack.bregan.me/game/${game.id}`,
      // Use the current date as a fallback if lastUpdated is null or undefined
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
        'Cache-Control': 'public, max-age=3600', // Using the revalidate value
        'x-content-type-options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Failed to generate game sitemap:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
