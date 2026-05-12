import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useResponsive } from '@/hooks/useResponsive';
import { AchievementSearchResult } from '@/interfaces/api/search/DoSearchResponse';
import { searchCompact, searchStyles } from '@/styles/search';

type Props = { result: AchievementSearchResult };

export function AchievementSearchCard({ result }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;
  const badgeUrl = `https://media.retroachievements.org/Badge/${result.iconUrl}.png`;

  return (
    <TouchableOpacity
      style={[searchStyles.achievementCard, c && searchCompact.achievementCard]}
      activeOpacity={0.7}
      onPress={() => router.navigate('/game/' + result.gameId as any)}
    >
      <Image
        source={{ uri: badgeUrl }}
        style={[searchStyles.achievementIcon, c && searchCompact.achievementIcon]}
      />
      <View style={searchStyles.achievementInfo}>
        <Text style={[searchStyles.achievementTitle, c && searchCompact.achievementTitle]} numberOfLines={1}>
          {result.title}
        </Text>
        {result.description ? (
          <Text style={[searchStyles.achievementDesc, c && searchCompact.achievementDesc]} numberOfLines={2}>
            {result.description}
          </Text>
        ) : null}
        <Text style={searchStyles.achievementGame}>
          {result.gameTitle} · {result.console}
        </Text>
      </View>
      <Text style={[searchStyles.achievementPoints, c && searchCompact.achievementPoints]}>
        {result.points}
      </Text>
    </TouchableOpacity>
  );
}
