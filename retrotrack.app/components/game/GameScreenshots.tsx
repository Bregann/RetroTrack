import { Image, View } from 'react-native';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

type Props = {
  imageInGame: string | null;
  imageTitle: string | null;
};

export function GameScreenshots({ imageInGame, imageTitle }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  if (!imageInGame && !imageTitle) return null;

  return (
    <View style={gamePageStyles.screenshotsRow}>
      {imageInGame ? (
        <Image
          source={{ uri: getGameIconUrl(imageInGame) }}
          style={[gamePageStyles.screenshot, c && gamePageCompact.screenshot]}
          resizeMode="cover"
        />
      ) : null}
      {imageTitle ? (
        <Image
          source={{ uri: getGameIconUrl(imageTitle) }}
          style={[gamePageStyles.screenshot, c && gamePageCompact.screenshot]}
          resizeMode="cover"
        />
      ) : null}
    </View>
  );
}
