import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { GameSearchResult } from '@/interfaces/api/search/DoSearchResponse';
import { searchCompact, searchStyles } from '@/styles/search';

type Props = { result: GameSearchResult };

export function GameSearchCard({ result }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <TouchableOpacity
      style={[searchStyles.gameCard, c && searchCompact.gameCard]}
      activeOpacity={0.7}
      onPress={() => router.navigate('/game/' + result.gameId as any)}
    >
      <Image
        source={{ uri: getGameIconUrl(result.gameIconUrl) }}
        style={[searchStyles.gameIcon, c && searchCompact.gameIcon]}
      />
      <View style={searchStyles.gameInfo}>
        <Text style={[searchStyles.gameTitle, c && searchCompact.gameTitle]} numberOfLines={1}>
          {result.title}
        </Text>
        <View style={searchStyles.gameMeta}>
          <View style={[{ paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, backgroundColor: '#373A40' }]}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>{result.console}</Text>
          </View>
          <Text style={searchStyles.gameStat}>🏆 {result.totalAchievements}</Text>
          <Text style={searchStyles.gameStat}>⭐ {result.totalPoints}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
