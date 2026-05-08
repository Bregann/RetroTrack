import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { GameData } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse';
import { homeCompact, homeStyles } from '@/styles/home';
import { CONSOLE_COLORS } from './consoleColors';

type Props = {
  game: GameData;
};

export function GameUpdateCard({ game }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <TouchableOpacity
      style={[homeStyles.updateCard, c && homeCompact.updateCard]}
      activeOpacity={0.7}
      onPress={() => router.navigate(`/game/${game.gameId}` as any)}
    >
      <Image
        source={{ uri: getGameIconUrl(game.gameIcon) }}
        style={[homeStyles.updateIcon, c && homeCompact.updateIcon]}
      />
      <View style={homeStyles.updateInfo}>
        <Text style={[homeStyles.updateTitle, c && homeCompact.updateTitle]} numberOfLines={1}>
          {game.title}
        </Text>
        <View style={[homeStyles.updateMeta, c && homeCompact.updateMeta]}>
          <View
            style={[
              homeStyles.updateConsoleTag,
              c && homeCompact.updateConsoleTag,
              { backgroundColor: CONSOLE_COLORS[game.consoleType] ?? '#836d6d' },
            ]}
          >
            <Text style={[homeStyles.updateConsoleText, c && homeCompact.updateConsoleText]}>{game.consoleName}</Text>
          </View>
          <Text style={[homeStyles.updateAchievements, c && homeCompact.updateAchievements]}>🏆 {game.achievementCount}</Text>
          <Text style={[homeStyles.updatePoints, c && homeCompact.updatePoints]}>⭐ {game.points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
