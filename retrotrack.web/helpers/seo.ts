export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://retrotrack.bregan.me'
export const SITE_NAME = 'RetroTrack'
export const RA_MEDIA_URL = 'https://media.retroachievements.org'

/**
 * Builds an absolute canonical URL for a given path.
 * Search engines treat http/https and trailing-slash variants as separate URLs,
 * so every page declares one canonical form.
 */
export const absoluteUrl = (path: string): string => {
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalised === '/' ? '' : normalised}`
}

/**
 * Resolves a RetroAchievements media path (e.g. /Images/12345.png) to an absolute
 * URL suitable for use as an Open Graph image. Crawlers do not resolve relative paths.
 */
export const raImageUrl = (path: string | null | undefined): string | undefined => {
  if (path === null || path === undefined || path.trim() === '') {
    return undefined
  }

  if (path.startsWith('http')) {
    return path
  }

  return `${RA_MEDIA_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Serialises a JSON-LD object for embedding in a script tag.
 * JSON.stringify does not escape `<`, so a value containing `</script>` would
 * otherwise terminate the tag early and inject markup into the page.
 */
export const jsonLdScript = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, '\\u003c')
