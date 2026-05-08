import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementCard } from '@/components/game/AchievementCard';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { getGameIconUrl } from '@/helpers/mediaUrls';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useResponsive } from '@/hooks/useResponsive';
import { GetLoggedInSpecificGameInfoResponse } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';
import { CONSOLE_COLORS } from '@/components/home/consoleColors';

export default function GamePage() {
  const { gameId } = useLocalSearchParams<{ gameId: string }>();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { isCompact } = useResponsive();
  const c = isCompact;
  const [hideUnlocked, setHideUnlocked] = useState(false);
  const [showProgressionOnly, setShowProgressionOnly] = useState(false);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQueryGet<GetLoggedInSpecificGameInfoResponse>({
    url: `/api/games/GetGameInfoForUser/${gameId}`,
    queryKey: [QueryKeys.GameDetail, gameId ?? '0'],
    staleTime: 60_000,
  });

  useEffect(() => {
    if (data?.title) {
      navigation.setOptions({ title: data.title });
    }
  }, [data?.title, navigation]);

  const filteredAchievements = data?.achievements.filter((a) => {
    if (hideUnlocked && (a.dateEarnedHardcore || a.dateEarnedSoftcore)) return false;
    if (showProgressionOnly && a.type !== 1) return false;
    return true;
  }) ?? [];

  const handleUpdate = useCallback(() => {
    // TODO: hook up update mutation
  }, []);

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
        <Text style={{ fontSize: 15, color: '#fa5252', fontWeight: '600' }}>Failed to load game</Text>
        <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 12, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#1976d2', borderRadius: 8 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const totalEarned = data.achievementsAwardedTotal;
  const totalAchievements = data.achievementCount;

  return (
    <ThemedView style={gamePageStyles.container}>
      <ScrollView
        contentContainerStyle={[gamePageStyles.scrollContent, { paddingTop: insets.top + 8 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} tintColor="#1976d2" />
        }
      >
        {/* Box Art */}
        {data.imageBoxArt ? (
          <Image
            source={{ uri: getGameIconUrl(data.imageBoxArt) }}
            style={[gamePageStyles.heroBoxArt, c && gamePageCompact.heroBoxArt]}
            resizeMode="contain"
          />
        ) : null}

        {/* Title + Icon + Console */}
        <View style={gamePageStyles.heroTitleRow}>
          <Image
            source={{ uri: getGameIconUrl(data.gameImage) }}
            style={[gamePageStyles.heroIcon, c && gamePageCompact.heroIcon]}
          />
          <Text style={[gamePageStyles.heroTitle, c && gamePageCompact.heroTitle]}>{data.title}</Text>
        </View>
        <View style={[gamePageStyles.heroConsoleTag, c && gamePageCompact.heroConsoleTag, { backgroundColor: CONSOLE_COLORS[data.consoleId] ?? '#836d6d' }]}>
          <Text style={[gamePageStyles.heroConsoleText, c && gamePageCompact.heroConsoleText]}>{data.consoleName}</Text>
        </View>

        {/* Screenshots */}
        {(data.imageInGame || data.imageTitle) && (
          <View style={gamePageStyles.screenshotsRow}>
            {data.imageInGame ? (
              <Image source={{ uri: getGameIconUrl(data.imageInGame) }} style={[gamePageStyles.screenshot, c && gamePageCompact.screenshot]} resizeMode="cover" />
            ) : null}
            {data.imageTitle ? (
              <Image source={{ uri: getGameIconUrl(data.imageTitle) }} style={[gamePageStyles.screenshot, c && gamePageCompact.screenshot]} resizeMode="cover" />
            ) : null}
          </View>
        )}

        {/* Stats Grid */}
        <View style={[gamePageStyles.statsGrid, c && gamePageCompact.statsGrid]}>
          <View style={[gamePageStyles.statCard, c && gamePageCompact.statCard]}>
            <Text style={gamePageStyles.statLabel}>Achievements</Text>
            <Text style={[gamePageStyles.statValue, c && gamePageCompact.statValue]}>
              {totalEarned}/{totalAchievements}
            </Text>
            <Text style={gamePageStyles.statSubtext}>
              {totalAchievements > 0 ? Math.round((totalEarned / totalAchievements) * 100) : 0}% complete
            </Text>
          </View>
          <View style={gamePageStyles.statCard}>
            <Text style={gamePageStyles.statLabel}>Points</Text>
            <Text style={gamePageStyles.statValue}>
              {data.pointsAwardedTotal}/{data.totalGamePoints}
            </Text>
            <Text style={gamePageStyles.statSubtext}>HC: {data.pointsAwardedHardcore} SC: {data.pointsAwardedSoftcore}</Text>
          </View>
          {data.medianTimeToBeatHardcoreFormatted ? (
            <View style={gamePageStyles.statCard}>
              <Text style={gamePageStyles.statLabel}>Time to Beat</Text>
              <Text style={gamePageStyles.statValue}>{data.medianTimeToBeatHardcoreFormatted}</Text>
            </View>
          ) : null}
          {data.medianTimeToMasterFormatted ? (
            <View style={gamePageStyles.statCard}>
              <Text style={gamePageStyles.statLabel}>Time to Master</Text>
              <Text style={gamePageStyles.statValue}>{data.medianTimeToMasterFormatted}</Text>
            </View>
          ) : null}
        </View>

        {/* Info rows */}
        <Text style={[gamePageStyles.sectionTitle, c && gamePageCompact.sectionTitle]}>Game Details</Text>
        {data.genre ? (
          <View style={[gamePageStyles.infoRow, c && gamePageCompact.infoRow]}>
            <Text style={[gamePageStyles.infoLabel, c && gamePageCompact.infoLabel]}>Genre</Text>
            <Text style={[gamePageStyles.infoValue, c && gamePageCompact.infoValue]}>{data.genre}</Text>
          </View>
        ) : null}
        {data.developer ? (
          <View style={[gamePageStyles.infoRow, c && gamePageCompact.infoRow]}>
            <Text style={[gamePageStyles.infoLabel, c && gamePageCompact.infoLabel]}>Developer</Text>
            <Text style={[gamePageStyles.infoValue, c && gamePageCompact.infoValue]}>{data.developer}</Text>
          </View>
        ) : null}
        {data.publisher ? (
          <View style={[gamePageStyles.infoRow, c && gamePageCompact.infoRow]}>
            <Text style={[gamePageStyles.infoLabel, c && gamePageCompact.infoLabel]}>Publisher</Text>
            <Text style={[gamePageStyles.infoValue, c && gamePageCompact.infoValue]}>{data.publisher}</Text>
          </View>
        ) : null}
        <View style={[gamePageStyles.infoRow, c && gamePageCompact.infoRow]}>
          <Text style={[gamePageStyles.infoLabel, c && gamePageCompact.infoLabel]}>Players</Text>
          <Text style={[gamePageStyles.infoValue, c && gamePageCompact.infoValue]}>{data.players}</Text>
        </View>

        {/* Achievement Filters */}
        <Text style={[gamePageStyles.sectionTitle, c && gamePageCompact.sectionTitle, { marginTop: 16 }]}>Achievements</Text>
        <View style={gamePageStyles.filterBar}>
          <TouchableOpacity
            style={[gamePageStyles.filterChip, hideUnlocked && gamePageStyles.filterChipActive]}
            onPress={() => setHideUnlocked((v) => !v)}
          >
            <Text style={[gamePageStyles.filterChipText, hideUnlocked && gamePageStyles.filterChipTextActive]}>
              Hide Unlocked
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[gamePageStyles.filterChip, showProgressionOnly && gamePageStyles.filterChipActive]}
            onPress={() => setShowProgressionOnly((v) => !v)}
          >
            <Text style={[gamePageStyles.filterChipText, showProgressionOnly && gamePageStyles.filterChipTextActive]}>
              Progression Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Achievement List */}
        {filteredAchievements.map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}

        {/* Subsets */}
        {data.subsets.length > 0 && (
          <>
            <Text style={[gamePageStyles.sectionTitle, { marginTop: 16 }]}>Subsets</Text>
            {data.subsets.map((subset) => (
              <TouchableOpacity
                key={subset.gameId}
                style={gamePageStyles.subsetCard}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: getGameIconUrl(subset.gameImage) }}
                  style={gamePageStyles.subsetIcon}
                />
                <View style={gamePageStyles.subsetInfo}>
                  <Text style={gamePageStyles.subsetTitle} numberOfLines={1}>{subset.title}</Text>
                  <Text style={gamePageStyles.subsetProgress}>
                    {subset.achievementsUnlocked}/{subset.achievementCount} · {subset.percentageComplete}% · {subset.points} pts
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>

      {/* Floating Update Button */}
      <TouchableOpacity
        style={[gamePageStyles.floatingButton, c && gamePageCompact.floatingButton, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.7}
        onPress={handleUpdate}
      >
        <Text style={[gamePageStyles.floatingButtonText, c && gamePageCompact.floatingButtonText]}>🔄 Update Game</Text>
      </TouchableOpacity>
    </ThemedView>
  );
}
