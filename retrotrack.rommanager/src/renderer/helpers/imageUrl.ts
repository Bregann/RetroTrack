// Must match the constants in main/imageCache.ts
const CACHE_SCHEME = 'ra-cache';
const RA_HOST = 'media.retroachievements.org';

/**
 * Convert a RetroAchievements image path (e.g. `/Images/012345.png`) into a
 * cached `ra-cache://media.retroachievements.org/Images/012345.png` URL.
 * Returns `null` for empty/falsy paths.
 */
export function raImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  const normalised = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${CACHE_SCHEME}://${RA_HOST}${normalised}`;
}
