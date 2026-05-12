import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { Last5GameInfo } from '@/interfaces/api/users/GetUserProfileResponse';
import { profileCompact, profileStyles } from '@/styles/profile';

type Props = {
  title: string;
  games: Last5GameInfo[];
};

export function RecentGamesList({ title, games }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  if (games.length === 0) return null;

  return (
    <View style={[profileStyles.section, c && profileCompact.section]}>
      <Text style={[profileStyles.sectionTitle, c && profileCompact.sectionTitle]}>{title}</Text>
      {games.map((game) => {
        const earned = game.achievementsUnlockedHardcore + game.achievementsUnlockedSoftcore;
        return (
          <TouchableOpacity
            key={game.gameId}
            style={[profileStyles.recentCard, c && profileCompact.recentCard]}
            activeOpacity={0.7}
            onPress={() => router.navigate('/game/' + game.gameId as any)}
          >
            <Image
              source={{ uri: getGameIconUrl(game.imageUrl) }}
              style={[profileStyles.recentIcon, c && profileCompact.recentIcon]}
            />
            <View style={profileStyles.recentInfo}>
              <Text style={[profileStyles.recentTitle, c && profileCompact.recentTitle]} numberOfLines={1}>
                {game.title}
              </Text>
              <View style={profileStyles.recentMeta}>
                <Text style={profileStyles.recentStat}>
                  🏆 {earned}/{game.totalGameAchievements}
                </Text>
                <Text style={profileStyles.recentStat}>⭐ {game.totalGamePoints}</Text>
              </View>
            </View>
            <Text style={profileStyles.recentDate}>
              {new Date(game.datePlayed).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
