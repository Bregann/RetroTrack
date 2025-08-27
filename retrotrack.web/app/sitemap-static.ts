import { MetadataRoute } from 'next'
import { doGet } from '@/helpers/apiClient'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: 'https://retrotrack.bregan.me/', lastModified: new Date() },
    { url: 'https://retrotrack.bregan.me/home', lastModified: new Date() },
    { url: 'https://retrotrack.bregan.me/console/allgames', lastModified: new Date() }
  ]

  // Add console URLs
  try {
    const consoleData = await doGet<number[]>('/api/sitemap/GetConsoleIds')
    if (consoleData.ok && consoleData.data !== undefined) {
      const consoleUrls = consoleData.data.map((consoleId) => ({
        url: `https://retrotrack.bregan.me/console/${consoleId}`,
        lastModified: new Date(),
      }))
      entries.push(...consoleUrls)
    }
  } catch (error) {
    console.error('Failed to fetch console IDs for sitemap:', error)
  }

  return entries
}
