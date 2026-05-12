const RA_MEDIA_BASE = 'https://media.retroachievements.org';

export function getGameIconUrl(gameIcon: string): string {
  if (!gameIcon) return '';
  return `${RA_MEDIA_BASE}${gameIcon}`;
}

export function getUserProfilePicUrl(profileImageUrl: string): string {
  if (!profileImageUrl) return '';
  return `${RA_MEDIA_BASE}${profileImageUrl}`;
}
