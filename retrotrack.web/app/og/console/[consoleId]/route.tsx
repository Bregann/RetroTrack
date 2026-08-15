import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { doQueryGet } from '@/helpers/apiClient'
import { GetGamesForConsoleResponse } from '@/interfaces/api/games/GetGamesForConsoleResponse'
import {
  BRAND_FONT,
  formatCount,
  hasBrandFont,
  loadOgFonts,
  OG_COLORS,
  OG_SIZE,
  truncate
} from '@/helpers/ogImage'

/**
 * Open Graph card for console pages.
 *
 * This lives under /og/console/[consoleId] rather than as an opengraph-image.tsx
 * beside the page, because /console/[...consoleId] is a catch-all route and Next
 * forbids static segments inside one. The console page references this URL
 * explicitly via its `openGraph.images` metadata.
 */

export const revalidate = 3600

function Stat({ value, label, color }: { value: string, label: string, color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '20px 30px',
        backgroundColor: OG_COLORS.bgRaised,
        border: `2px solid ${OG_COLORS.border}`,
        borderRadius: 12
      }}
    >
      <div style={{ display: 'flex', fontSize: 40, color, fontWeight: 700 }}>{value}</div>
      <div
        style={{
          display: 'flex',
          fontSize: 18,
          color: OG_COLORS.textMuted,
          letterSpacing: 1.5,
          textTransform: 'uppercase'
        }}
      >
        {label}
      </div>
    </div>
  )
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ consoleId: string }> }
): Promise<Response> {
  const { consoleId } = await params

  let data: GetGamesForConsoleResponse | null = null

  try {
    data = await doQueryGet<GetGamesForConsoleResponse>(
      `/api/games/GetGamesForConsole?ConsoleId=${consoleId}&Skip=0&Take=1&SortByName=true`,
      { next: { revalidate: 3600 } }
    )
  } catch {
    // Fall through to the branded fallback below
  }

  const fonts = await loadOgFonts()

  const heading = data !== null ? data.consoleName : 'All Consoles'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: OG_COLORS.bg,
          color: OG_COLORS.text,
          padding: 64,
          borderTop: `8px solid ${OG_COLORS.accentStrong}`
        }}
      >
        {/* Brand bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 14,
              height: 34,
              backgroundColor: OG_COLORS.accent,
              borderRadius: 3
            }}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              color: OG_COLORS.accent,
              fontFamily: hasBrandFont(fonts) ? BRAND_FONT : undefined
            }}
          >
            RetroTrack
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              display: 'flex',
              fontSize: heading.length > 26 ? 62 : 78,
              fontWeight: 700,
              lineHeight: 1.1
            }}
          >
            {truncate(heading, 42)}
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: OG_COLORS.textMuted }}>
            RetroAchievements progress tracking
          </div>
        </div>

        {data !== null
          ? (
            <div style={{ display: 'flex', gap: 20 }}>
              <Stat value={formatCount(data.totalCount)} label="Games" color={OG_COLORS.accent} />
              {data.totalAchievements > 0 && (
                <Stat
                  value={formatCount(data.totalAchievements)}
                  label="Achievements"
                  color={OG_COLORS.gold}
                />
              )}
              {data.totalPlayers > 0 && (
                <Stat value={formatCount(data.totalPlayers)} label="Players" color={OG_COLORS.teal} />
              )}
            </div>
          )
          : <div style={{ display: 'flex' }} />}
      </div>
    ),
    { ...OG_SIZE, fonts }
  )
}
