import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DaySection } from '@/components/home/DaySection';
import { LastPlayedCard } from '@/components/home/LastPlayedCard';
import { QuickLinks } from '@/components/home/QuickLinks';
import { WelcomeHeader } from '@/components/home/WelcomeHeader';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useProfileUpdate } from '@/helpers/useProfileUpdate';
import { useResponsive } from '@/hooks/useResponsive';
import { GetMobileHomeDataResponse } from '@/interfaces/api/users/GetMobileHomeDataResponse';
import { homeCompact, homeStyles } from '@/styles/home';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const { requestUpdate, isUpdating, isProcessing } = useProfileUpdate();
  const sx = (key: keyof typeof homeCompact): any =>
    isCompact && key in homeCompact ? [homeStyles[key], homeCompact[key]] : homeStyles[key];

  const { data, isLoading, isError } = useQueryGet<GetMobileHomeDataResponse>({
    url: '/api/Users/GetMobileHomeData',
    queryKey: [QueryKeys.MobileHomeData],
    staleTime: 60_000,
  });

  return (
    <ThemedView style={homeStyles.container}>
      <ScrollView
        contentContainerStyle={[sx('scrollContent'), { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && (
          <View style={homeStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={homeStyles.loadingText}>Loading your retro world...</Text>
          </View>
        )}

        {isError && (
          <View style={homeStyles.loadingContainer}>
            <Text style={homeStyles.errorText}>Failed to load data</Text>
            <Text style={homeStyles.emptyText}>Pull down to try again</Text>
          </View>
        )}

        {data && (
          <>
            <WelcomeHeader
              username={data.username}
              trackedGamesCount={data.trackedGamesCount}
              hardcorePoints={data.hardcorePoints}
              softcorePoints={data.softcorePoints}
            />

            <QuickLinks
              username={data.username}
              trackedGamesCount={data.trackedGamesCount}
            />

            <Text style={sx('sectionTitle')}>Last Played</Text>
            {data.lastPlayedGame ? (
              <LastPlayedCard game={data.lastPlayedGame} />
            ) : (
              <View style={sx('lastPlayedCard')}>
                <Text style={homeStyles.lastPlayedEmpty}>No games played yet</Text>
              </View>
            )}

            <Text style={sx('sectionTitle')}>Recent Updates</Text>
            {data.recentDays.map((day) => (
              <DaySection key={day.date} day={day} />
            ))}
          </>
        )}
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
        {isUpdating ? <ActivityIndicator size="small" color="#fff" /> : null}
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
          {isProcessing ? 'Updating...' : isUpdating ? 'Requesting...' : 'Update Profile'}
        </Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
