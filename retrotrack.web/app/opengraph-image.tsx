import { ImageResponse } from 'next/og'
import {
  BRAND_FONT,
  hasBrandFont,
  loadOgFonts,
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE
} from '@/helpers/ogImage'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'RetroTrack - RetroAchievements achievement tracker'

// Static content, so this is generated once at build time
export const revalidate = false

const features = [
  'Every console',
  'Achievements & leaderboards',
  'Community playlists'
]

export default async function Image() {
  const fonts = await loadOgFonts()

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
          gap: 36,
          backgroundColor: OG_COLORS.bg,
          color: OG_COLORS.text,
          padding: 72,
          borderTop: `8px solid ${OG_COLORS.accentStrong}`
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 62,
            color: OG_COLORS.accent,
            fontFamily: hasBrandFont(fonts) ? BRAND_FONT : undefined,
            textAlign: 'center'
          }}
        >
          RetroTrack
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: OG_COLORS.text,
            textAlign: 'center'
          }}
        >
          A feature-full achievement tracker for RetroAchievements
        </div>

        {/* flexWrap keeps the pills inside the card if the copy ever grows */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 14,
            marginTop: 4
          }}
        >
          {features.map((feature) => (
            <div
              key={feature}
              style={{
                display: 'flex',
                fontSize: 22,
                color: OG_COLORS.textMuted,
                backgroundColor: OG_COLORS.bgRaised,
                border: `2px solid ${OG_COLORS.border}`,
                borderRadius: 999,
                padding: '12px 26px'
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
