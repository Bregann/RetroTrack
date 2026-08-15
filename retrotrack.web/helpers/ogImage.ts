/**
 * Shared building blocks for generated Open Graph images.
 *
 * Every social card is rendered at 1200x630 - the size Twitter/X, Discord,
 * Facebook and LinkedIn all crop from - via Next's ImageResponse (Satori).
 *
 * Satori supports only a subset of CSS: flexbox only (no grid, no float),
 * every element needs an explicit display, and text must live in a leaf node.
 */

export const OG_WIDTH = 1200
export const OG_HEIGHT = 630

export const OG_SIZE = { width: OG_WIDTH, height: OG_HEIGHT }
export const OG_CONTENT_TYPE = 'image/png'

/**
 * Taken from the site's own palette so cards read as RetroTrack at a glance:
 * the greys are the Mantine dark scale in app/layout.tsx, and the blues are the
 * accents already dominant across css/ (#1976d2 primary, #74c0fc light).
 */
export const OG_COLORS = {
  bg: '#15171C',
  bgRaised: '#1D2026',
  border: '#2F333B',
  text: '#F3F4F6',
  textMuted: '#9BA1A9',
  accent: '#74c0fc',
  accentStrong: '#1976d2',
  gold: '#FFD43B',
  teal: '#20C997'
}

/** Font family name for the retro wordmark. Body text omits fontFamily and
 *  falls back to Satori's bundled Geist, which is far more readable at size. */
export const BRAND_FONT = 'PressStart2P'

type OgFont = {
  name: string
  data: ArrayBuffer
  style: 'normal'
  weight: 400
}

/**
 * Reads a TTF from disk and returns a standalone ArrayBuffer.
 *
 * A Node Buffer is a view onto a shared pool, so its raw .buffer can contain
 * unrelated bytes - the slice below copies out just this file's range.
 */
async function readFontFile(...segments: string[]): Promise<ArrayBuffer | null> {
  try {
    // Imported lazily so these Node-only modules never reach a client bundle
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')

    const buffer = await readFile(join(process.cwd(), ...segments))

    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    ) as ArrayBuffer
  } catch {
    return null
  }
}

/**
 * Loads the fonts every card needs: Press Start 2P for the RetroTrack wordmark
 * and Geist for everything else.
 *
 * Both are read from disk rather than fetched. Google Fonts only serves woff2
 * from its CSS endpoint, which Satori rejects outright ("Unsupported OpenType
 * signature wOF2"), and a local read removes a network hop from every render.
 *
 * Geist ships inside @vercel/og and is Satori's own default face, so listing it
 * explicitly is what keeps the pixel font scoped to the wordmark - supply only
 * Press Start 2P and Satori renders the entire card in it.
 */
export async function loadOgFonts(): Promise<OgFont[] | undefined> {
  const [brand, body] = await Promise.all([
    readFontFile('font', 'PressStart2P-Regular.ttf'),
    readFontFile('node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'Geist-Regular.ttf')
  ])

  const fonts: OgFont[] = []

  // Geist must come first so it wins as the default family for unstyled text
  if (body !== null) {
    fonts.push({ name: 'Geist', data: body, style: 'normal', weight: 400 })
  }

  if (brand !== null) {
    fonts.push({ name: BRAND_FONT, data: brand, style: 'normal', weight: 400 })
  }

  // Returning undefined lets ImageResponse fall back to its own bundled default
  return fonts.length > 0 ? fonts : undefined
}

/** True when the retro wordmark face is available for use as a fontFamily */
export const hasBrandFont = (fonts: OgFont[] | undefined): boolean =>
  fonts?.some((font) => font.name === BRAND_FONT) ?? false

/**
 * Truncates a title to keep it inside the card. Press Start 2P is a wide
 * monospace face, so long game names overflow well before typical CSS limits.
 */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

/** Formats large player counts compactly (12345 -> 12.3k) so stat tiles stay aligned */
export function formatCount(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
  }

  return value.toString()
}
