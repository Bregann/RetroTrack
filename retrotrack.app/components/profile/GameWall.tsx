import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { WallGame } from '@/interfaces/api/users/GetUserProfileResponse';
import { profileCompact, profileStyles } from '@/styles/profile';

type Props = {
  title: string;
  count: number;
  games: WallGame[];
};

export function GameWall({ title, count, games }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  if (games.length === 0) return null;

  return (
    <View style={[profileStyles.section, c && profileCompact.section]}>
      <Text style={[profileStyles.sectionTitle, c && profileCompact.sectionTitle]}>
        {title} <Text style={profileStyles.sectionCount}>({count})</Text>
      </Text>
      <View style={[profileStyles.wallGrid, c && profileCompact.wallGrid]}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.gameId}
            activeOpacity={0.7}
            onPress={() => router.navigate('/game/' + game.gameId as any)}
          >
            <Image
              source={{ uri: getGameIconUrl(game.imageUrl) }}
              style={[
                profileStyles.wallIcon,
                c && profileCompact.wallIcon,
                game.isHardcore ? profileStyles.wallIconHardcore : profileStyles.wallIconSoftcore,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
