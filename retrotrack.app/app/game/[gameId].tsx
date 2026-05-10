import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementCard } from '@/components/game/AchievementCard';
import { AchievementFilters } from '@/components/game/AchievementFilters';
import { GameHeroSection } from '@/components/game/GameHeroSection';
import { GameInfoSection } from '@/components/game/GameInfoSection';
import { GameScreenshots } from '@/components/game/GameScreenshots';
import { GameStatsGrid } from '@/components/game/GameStatsGrid';
import { SubsetList } from '@/components/game/SubsetList';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useResponsive } from '@/hooks/useResponsive';
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

export default function GamePage() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isCompact } = useResponsive();
  const [hideUnlocked, setHideUnlocked] = useState(false);
  const [showProgressionOnly, setShowProgressionOnly] = useState(false);

  const { data, isLoading, isError, refetch } = useQueryGet<GetLoggedInSpecificGameInfoResponse>({
    url: `/api/games/GetGameInfoForUser/${gameId}`,
    queryKey: [QueryKeys.GameDetail, gameId ?? '0'],
    staleTime: 60_000,
  });

  useEffect(() => {
    if (data?.title) navigation.setOptions({ title: data.title });
  }, [data?.title, navigation]);

  const filteredAchievements = useMemo(
    () =>
      data?.achievements.filter((a) => {
        if (hideUnlocked && (a.dateEarnedHardcore || a.dateEarnedSoftcore)) return false;
        if (showProgressionOnly && a.type !== 1) return false;
        return true;
      }) ?? [],
    [data?.achievements, hideUnlocked, showProgressionOnly],
  );

  // ---- Loading / Error ----
  if (isLoading) {
    return (
      <ThemedView style={gamePageStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={gamePageStyles.loadingText}>Loading game...</Text>
      </ThemedView>
    );
  }

  if (isError || !data) {
    return (
      <ThemedView style={gamePageStyles.loadingContainer}>
        <Text style={{ fontSize: 15, color: '#fa5252', fontWeight: '600' }}>
          Failed to load game
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            marginTop: 12,
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#1976d2',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const stats = [
    {
      label: 'Achievements',
      value: `${data.achievementsAwardedTotal}/${data.achievementCount}`,
      subtext:
        data.achievementCount > 0
          ? `${Math.round((data.achievementsAwardedTotal / data.achievementCount) * 100)}% complete`
          : undefined,
    },
    {
      label: 'Points',
      value: `${data.pointsAwardedTotal}/${data.totalGamePoints}`,
      subtext: `HC: ${data.pointsAwardedHardcore}  SC: ${data.pointsAwardedSoftcore}`,
    },
    data.medianTimeToBeatHardcoreFormatted
      ? { label: 'Time to Beat', value: data.medianTimeToBeatHardcoreFormatted }
      : null,
    data.medianTimeToMasterFormatted
      ? { label: 'Time to Master', value: data.medianTimeToMasterFormatted }
      : null,
  ];

  const details = [
    data.genre ? { label: 'Genre', value: data.genre } : null,
    data.developer ? { label: 'Developer', value: data.developer } : null,
    data.publisher ? { label: 'Publisher', value: data.publisher } : null,
    { label: 'Players', value: String(data.players) },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <ThemedView style={gamePageStyles.container}>
      <ScrollView
        contentContainerStyle={[gamePageStyles.scrollContent, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor="#1976d2" />
        }
      >
        <GameHeroSection
          gameImage={data.gameImage}
          imageBoxArt={data.imageBoxArt}
          title={data.title}
          consoleName={data.consoleName}
          consoleId={data.consoleId}
        />

        <GameScreenshots imageInGame={data.imageInGame} imageTitle={data.imageTitle} />

        <GameStatsGrid stats={stats} />

        <GameInfoSection details={details} />

        <AchievementFilters
          hideUnlocked={hideUnlocked}
          showProgressionOnly={showProgressionOnly}
          onToggleHideUnlocked={() => setHideUnlocked((v) => !v)}
          onToggleProgressionOnly={() => setShowProgressionOnly((v) => !v)}
        />

        {filteredAchievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}

        <SubsetList subsets={data.subsets} />
      </ScrollView>

      <TouchableOpacity
        style={[
          gamePageStyles.floatingButton,
          isCompact && gamePageCompact.floatingButton,
          { bottom: insets.bottom + 20 },
        ]}
        activeOpacity={0.7}
        onPress={async () => await refetch()}
      >
        <Text style={gamePageStyles.floatingButtonText}>🔄 Update Game</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
