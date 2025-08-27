import { MetadataRoute } from 'next'
import { doGet } from '@/helpers/apiClient'
import { GetGameIdsResponse } from '@/interfaces/sitemap/GetGameIdsResponse'

const URLS_PER_SITEMAP = 45000 // Using 45k to be safe

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: 'https://retrotrack.bregan.me/sitemap-static',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0
    }
  ]

  // Calculate how many game sitemaps we need
  try {
    const gameData = await doGet<GetGameIdsResponse[]>('/api/sitemap/GetGameIds')
    if (gameData.ok && gameData.data !== undefined) {
      const totalGames = gameData.data.length
      const numberOfSitemaps = Math.ceil(totalGames / URLS_PER_SITEMAP)

      // Add entries for each game sitemap chunk
      for (let i = 0; i < numberOfSitemaps; i++) {
        sitemapEntries.push({
          url: `https://retrotrack.bregan.me/sitemap-games/${i}/sitemap.xml`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8
        })
      }
    }
  } catch (error) {
    console.error('Failed to calculate game sitemap chunks:', error)
  }

  return sitemapEntries
}
