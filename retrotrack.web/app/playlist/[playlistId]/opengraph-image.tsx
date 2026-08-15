import { ImageResponse } from 'next/og'
import { doQueryGet } from '@/helpers/apiClient'
import { GetPublicPlaylistDataResponse } from '@/interfaces/api/playlists/GetPublicPlaylistDataResponse'
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
export const alt = 'Game playlist on RetroTrack'

export const revalidate = 3600

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

export default async function Image({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = await params

  let playlist: GetPublicPlaylistDataResponse | null = null

  try {
    playlist = await doQueryGet<GetPublicPlaylistDataResponse>(
      `/api/playlists/GetPublicPlaylistData?PlaylistId=${playlistId}`,
      { next: { revalidate: 3600 } }
    )
  } catch {
    // Fall through to the branded fallback below
  }

  const fonts = await loadOgFonts()

  if (playlist === null) {
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
            Community game playlists
          </div>
        </div>
      ),
      { ...size, fonts }
    )
  }

  // Show up to 6 game icons as a visual strip - conveys "collection" at a glance
  const icons = playlist.icons
    .map((icon) => raImageUrl(icon))
    .filter((icon): icon is string => icon !== undefined)
    .slice(0, 6)

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
          padding: 56,
          borderTop: `8px solid ${OG_COLORS.accentStrong}`
        }}
      >
        {/* Brand bar with playlist eyebrow */}
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
          <div
            style={{
              display: 'flex',
              fontSize: 20,
              color: OG_COLORS.textMuted,
              letterSpacing: 2,
              textTransform: 'uppercase'
            }}
          >
            Playlist
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              fontSize: playlist.name.length > 30 ? 54 : 68,
              fontWeight: 700,
              lineHeight: 1.1
            }}
          >
            {truncate(playlist.name, 48)}
          </div>
          <div style={{ display: 'flex', fontSize: 26, color: OG_COLORS.textMuted }}>
            by {truncate(playlist.createdBy, 28)}
          </div>

          {icons.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
              {icons.map((icon, index) => (
                <img
                  key={index}
                  src={icon}
                  width={84}
                  height={84}
                  alt=""
                  style={{
                    borderRadius: 10,
                    border: `2px solid ${OG_COLORS.border}`,
                    objectFit: 'cover'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 18 }}>
          <Stat value={formatCount(playlist.numberOfGames)} label="Games" color={OG_COLORS.accent} />
          {playlist.totalAchievementsToEarn > 0 && (
            <Stat
              value={formatCount(playlist.totalAchievementsToEarn)}
              label="Achievements"
              color={OG_COLORS.gold}
            />
          )}
          {playlist.numberOfConsoles > 0 && (
            <Stat
              value={formatCount(playlist.numberOfConsoles)}
              label="Consoles"
              color={OG_COLORS.teal}
            />
          )}
        </div>
      </div>
    ),
    { ...size, fonts }
  )
}
