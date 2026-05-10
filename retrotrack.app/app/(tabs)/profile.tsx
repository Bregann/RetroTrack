import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameWall } from '@/components/profile/GameWall';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { RecentGamesList } from '@/components/profile/RecentGamesList';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useProfileUpdate } from '@/helpers/useProfileUpdate';
import { useResponsive } from '@/hooks/useResponsive';
import { GetMobileHomeDataResponse } from '@/interfaces/api/users/GetMobileHomeDataResponse';
import { GetUserProfileResponse } from '@/interfaces/api/users/GetUserProfileResponse';
import { profileCompact, profileStyles } from '@/styles/profile';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const c = isCompact;
  const { requestUpdate, isUpdating, isProcessing } = useProfileUpdate();

  // Step 1: get username from home data
  const { data: homeData } = useQueryGet<GetMobileHomeDataResponse>({
    url: '/api/Users/GetMobileHomeData',
    queryKey: [QueryKeys.MobileHomeData],
    staleTime: 60_000,
  });

  // Step 2: fetch profile using username
  const { data, isLoading, isError } = useQueryGet<GetUserProfileResponse>({
    url: `/api/users/GetUserProfile/${homeData?.username ?? ''}`,
    queryKey: [QueryKeys.UserProfile, homeData?.username ?? ''],
    staleTime: 60_000,
    enabled: !!homeData?.username,
  });

  if (isLoading || !data) {
    return (
      <View style={[profileStyles.empty, { paddingTop: insets.top + 40 }]}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[profileStyles.empty, { paddingTop: insets.top + 40 }]}>
        <Text style={profileStyles.emptyText}>Failed to load profile</Text>
      </View>
    );
  }

  const stats = [
    {
      icon: '🏆',
      label: 'Games Beaten',
      value: data.gamesBeatenHardcore + data.gamesBeatenSoftcore,
    },
    {
      icon: '👑',
      label: 'Completed/Mastered',
      value: data.gamesCompleted + data.gamesMastered,
    },
    {
      icon: '🎖',
      label: 'Achievements',
      value: data.achievementsEarnedHardcore + data.achievementsEarnedSoftcore,
    },
    {
      icon: '🎯',
      label: 'In Progress',
      value: data.gamesInProgress,
    },
  ];

  return (
    <ThemedView style={profileStyles.container}>
      <ScrollView
        contentContainerStyle={[
          profileStyles.scrollContent,
          c && profileCompact.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          username={data.raUsername}
          hardcorePoints={data.hardcorePoints}
          softcorePoints={data.softcorePoints}
          lastUpdated={new Date(data.lastUserUpdate).toLocaleString()}
        />

        <ProfileStats stats={stats} />

        <GameWall
          title="Beaten Games"
          count={data.gamesBeatenHardcore + data.gamesBeatenSoftcore}
          games={data.gamesBeatenWall}
        />

        <GameWall
          title="Completed/Mastered"
          count={data.gamesCompleted + data.gamesMastered}
          games={data.gamesMasteredWall}
        />

        <RecentGamesList title="Last 5 Played" games={data.last5GamesPlayed} />

        <RecentGamesList title="Last 5 Beaten/Mastered" games={data.last5Awards} />
      </ScrollView>

      {/* Floating update button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: insets.bottom + 20,
          right: 16,
          backgroundColor: isUpdating ? '#373A40' : '#1976d2',
          borderRadius: 28,
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          elevation: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
        activeOpacity={0.7}
        onPress={requestUpdate}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : null}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
          {isProcessing ? 'Updating...' : isUpdating ? 'Requesting...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
