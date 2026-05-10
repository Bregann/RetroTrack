import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { MobileLastPlayedGame } from '@/interfaces/api/users/GetMobileHomeDataResponse';
import { useResponsive } from '@/hooks/useResponsive';
import { homeCompact, homeStyles } from '@/styles/home';
import { CONSOLE_COLORS } from './consoleColors';

type Props = {
  game: MobileLastPlayedGame;
};

export function LastPlayedCard({ game }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <TouchableOpacity
      style={[homeStyles.lastPlayedCard, c && homeCompact.lastPlayedCard]}
      activeOpacity={0.7}
      onPress={() => router.navigate('/game/' + game.gameId as any)}
    >
      <Image
        source={{ uri: getGameIconUrl(game.gameIcon) }}
        style={[homeStyles.gameIcon, c && homeCompact.gameIcon]}
      />
      <View style={homeStyles.lastPlayedInfo}>
        <Text style={[homeStyles.lastPlayedName, c && homeCompact.lastPlayedName]} numberOfLines={1}>
          {game.title}
        </Text>
        <View
          style={[
            homeStyles.consoleBadge,
            c && homeCompact.consoleBadge,
            { backgroundColor: CONSOLE_COLORS[game.consoleType] ?? '#836d6d' },
          ]}
        >
          <Text style={[homeStyles.consoleBadgeText, c && homeCompact.consoleBadgeText]}>{game.consoleName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
