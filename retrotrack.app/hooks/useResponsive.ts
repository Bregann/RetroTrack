import { useWindowDimensions } from 'react-native';

/**
 * Returns true when the screen height is small enough to warrant compact layouts.
 * Ayn Thor bottom screen ≈ 480px; thresholds around 640px cover most small displays.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isCompact = height < 640 || width < 360;

  return { isCompact, width, height };
}
