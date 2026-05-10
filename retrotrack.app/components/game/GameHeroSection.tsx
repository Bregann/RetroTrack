import { Image, Text, View } from 'react-native';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';
import { CONSOLE_COLORS } from '@/components/home/consoleColors';

type Props = {
  gameImage: string;
  imageBoxArt: string | null;
  title: string;
  consoleName: string;
  consoleId: number;
};

export function GameHeroSection({ gameImage, imageBoxArt, title, consoleName, consoleId }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <>
      {imageBoxArt ? (
        <Image
          source={{ uri: getGameIconUrl(imageBoxArt) }}
          style={[gamePageStyles.heroBoxArt, c && gamePageCompact.heroBoxArt]}
          resizeMode="contain"
        />
      ) : null}

      <View style={gamePageStyles.heroTitleRow}>
        <Image
          source={{ uri: getGameIconUrl(gameImage) }}
          style={[gamePageStyles.heroIcon, c && gamePageCompact.heroIcon]}
        />
        <Text style={[gamePageStyles.heroTitle, c && gamePageCompact.heroTitle]}>{title}</Text>
      </View>

      <View
        style={[
          gamePageStyles.heroConsoleTag,
          c && gamePageCompact.heroConsoleTag,
          { backgroundColor: CONSOLE_COLORS[consoleId] ?? '#836d6d' },
        ]}
      >
        <Text style={[gamePageStyles.heroConsoleText, c && gamePageCompact.heroConsoleText]}>
          {consoleName}
        </Text>
      </View>
    </>
  );
}
