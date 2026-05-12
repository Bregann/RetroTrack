import { Image, Text, View } from 'react-native';

import { getUserProfilePicUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { profileCompact, profileStyles } from '@/styles/profile';

type Props = {
  username: string;
  profileImageUrl?: string;
  hardcorePoints: number;
  softcorePoints: number;
  lastUpdated: string;
};

export function ProfileHeader({ username, profileImageUrl, hardcorePoints, softcorePoints, lastUpdated }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <View style={[profileStyles.headerCard, c && profileCompact.headerCard]}>
      <Image
        source={{ uri: profileImageUrl || getUserProfilePicUrl(`/UserPic/${username}.png`) }}
        style={[profileStyles.avatar, c && profileCompact.avatar]}
      />
      <Text style={[profileStyles.username, c && profileCompact.username]}>{username}</Text>
      <View style={profileStyles.pointsRow}>
        <View style={profileStyles.pointsItem}>
          <Text style={profileStyles.pointsLabel}>Hardcore</Text>
          <Text style={[profileStyles.pointsValue, c && profileCompact.pointsValue]}>
            {hardcorePoints.toLocaleString()}
          </Text>
        </View>
        {softcorePoints > 0 && softcorePoints !== hardcorePoints ? (
          <View style={profileStyles.pointsItem}>
            <Text style={profileStyles.pointsLabel}>Softcore</Text>
            <Text style={[profileStyles.pointsValue, c && profileCompact.pointsValue]}>
              {softcorePoints.toLocaleString()}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={profileStyles.lastUpdated}>
        Last updated: {lastUpdated}
      </Text>
    </View>
  );
}
