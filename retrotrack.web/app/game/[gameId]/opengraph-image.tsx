import { ImageResponse } from 'next/og'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicSpecificGameInfoResponse } from '@/interfaces/api/games/GetPublicSpecificGameInfoResponse'
import { raImageUrl } from '@/helpers/seo'
import {
  BRAND_FONT,
  formatCount,
  hasBrandFont,
  loadOgFonts,
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  truncate
} from '@/helpers/ogImage'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Game achievements on RetroTrack'

// Regenerate at most once an hour - achievement counts change rarely
export const revalidate = 3600

/** A single labelled statistic in the bottom row of the card */
function Stat({ value, label, color }: { value: string, label: string, color: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '18px 26px',
        backgroundColor: OG_COLORS.bgRaised,
        border: `2px solid ${OG_COLORS.border}`,
        borderRadius: 12
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, color, fontWeight: 700 }}>{value}</div>
      <div
        style={{
          display: 'flex',
          fontSize: 17,
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

export default async function Image({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params

  let game: GetPublicSpecificGameInfoResponse | null = null

  try {
    game = await doQueryGet<GetPublicSpecificGameInfoResponse>(
      `/api/games/getPublicSpecificGameInfo/${gameId}`,
      { next: { revalidate: 3600 } }
    )
  } catch {
    // Fall through to the branded fallback card below
  }

  const fonts = await loadOgFonts()

  // Fallback: a branded card still beats no image at all if the API is unreachable
  if (game === null) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 24,
            backgroundColor: OG_COLORS.bg,
            color: OG_COLORS.text
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 52,
              color: OG_COLORS.accent,
              fontFamily: hasBrandFont(fonts) ? BRAND_FONT : undefined
            }}
          >
            RetroTrack
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: OG_COLORS.textMuted }}>
            RetroAchievements achievement tracker
          </div>
        </div>
      ),
      { ...size, fonts }
    )
  }

  const boxArt = raImageUrl(game.imageBoxArt) ?? raImageUrl(game.gameImage)
  const totalPoints = game.achievements.reduce((sum, achievement) => sum + achievement.points, 0)

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          flexDirection: 'column',
          backgroundColor: OG_COLORS.bg,
          color: OG_COLORS.text,
          padding: 56,
          // Flat ground plus a hard accent rule in the site's primary blue -
          // reads as RetroTrack at thumbnail size without an ambient glow
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

        {/* Main row: box art + title */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 44, marginTop: 8 }}>
          {boxArt !== undefined && (
            <img
              src={boxArt}
              width={260}
              height={260}
              alt=""
              style={{
                borderRadius: 16,
                border: `3px solid ${OG_COLORS.border}`,
                objectFit: 'cover'
              }}
            />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 18 }}>
            <div
              style={{
                display: 'flex',
                fontSize: game.title.length > 40 ? 46 : 58,
                fontWeight: 700,
                lineHeight: 1.15
              }}
            >
              {truncate(game.title, 72)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  color: OG_COLORS.text,
                  backgroundColor: OG_COLORS.bgRaised,
                  border: `2px solid ${OG_COLORS.border}`,
                  borderRadius: 999,
                  padding: '8px 22px'
                }}
              >
                {truncate(game.consoleName, 30)}
              </div>
              {game.genre !== '' && (
                <div style={{ display: 'flex', fontSize: 24, color: OG_COLORS.textMuted }}>
                  {truncate(game.genre, 28)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat row - the reason this card converts better than raw box art */}
        <div style={{ display: 'flex', gap: 18 }}>
          <Stat
            value={formatCount(game.achievementCount)}
            label="Achievements"
            color={OG_COLORS.accent}
          />
          {totalPoints > 0 && (
            <Stat value={formatCount(totalPoints)} label="Points" color={OG_COLORS.gold} />
          )}
          {game.players > 0 && (
            <Stat value={formatCount(game.players)} label="Players" color={OG_COLORS.teal} />
          )}
          {game.medianTimeToBeatHardcoreFormatted !== null && (
            <Stat
              value={game.medianTimeToBeatHardcoreFormatted}
              label="Median Beat"
              color={OG_COLORS.text}
            />
          )}
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
