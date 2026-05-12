import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { getUserProfilePicUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { homeCompact, homeStyles } from '@/styles/home';

type Props = {
  username: string;
  trackedGamesCount: number;
};

export function QuickLinks({ username, trackedGamesCount }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();

  return (
    <View style={[homeStyles.quickLinksRow, isCompact && homeCompact.quickLinksRow]}>
      <TouchableOpacity
        style={[homeStyles.quickLinkCard, isCompact && homeCompact.quickLinkCard]}
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <Image
          source={{ uri: getUserProfilePicUrl(`/UserPic/${username}.png`) }}
          style={[homeStyles.quickLinkProfilePic, isCompact && homeCompact.quickLinkProfilePic]}
        />
        <Text style={[homeStyles.quickLinkLabel, isCompact && homeCompact.quickLinkLabel]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[homeStyles.quickLinkCard, isCompact && homeCompact.quickLinkCard]}
        activeOpacity={0.7}
        onPress={() => router.push('/(tabs)/tracked-games')}
      >
        <Text style={homeStyles.quickLinkIcon}>🎮</Text>
        <Text style={[homeStyles.quickLinkLabel, isCompact && homeCompact.quickLinkLabel]}>Tracked Games</Text>
        <Text style={[homeStyles.quickLinkCount, isCompact && homeCompact.quickLinkCount]}>{trackedGamesCount}</Text>
      </TouchableOpacity>
    </View>
  );
}
