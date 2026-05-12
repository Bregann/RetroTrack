import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { GameList } from '@/components/game-list/GameList';
import { TrackedGamesFilterBar } from '@/components/game-list/TrackedGamesFilterBar';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { GetLoggedInPlaylistDataResponse, PlaylistGameItem } from '@/interfaces/api/playlists/GetLoggedInPlaylistDataResponse';
import { LoggedInGame } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse';
import { gameListStyles } from '@/styles/gameList';

function mapToLoggedInGame(item: PlaylistGameItem): LoggedInGame {
  const earned = item.achievementsEarnedSoftcore + item.achievementsEarnedHardcore;
  return {
    gameId: item.gameId,
    gameTitle: item.title,
    gameGenre: item.genre,
    achievementCount: item.achievementCount,
    achievementsUnlocked: earned,
    percentageComplete: item.achievementCount > 0 ? (earned / item.achievementCount) * 100 : 0,
    playerCount: item.players,
    gameImageUrl: item.gameIconUrl,
    points: item.points,
    consoleName: item.consoleName,
    highestAward: item.highestAward ?? 0,
    medianTimeToBeatHardcoreSeconds: item.medianTimeToBeatHardcoreSeconds,
    medianTimeToBeatHardcoreFormatted: item.medianTimeToBeatHardcoreFormatted,
    medianTimeToMasterSeconds: item.medianTimeToMasterSeconds,
    medianTimeToMasterFormatted: item.medianTimeToMasterFormatted,
  };
}

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [hideInProgress, setHideInProgress] = useState(false);
  const [hideBeaten, setHideBeaten] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const queryString = `PlaylistId=${id}&SortByIndex=true&Skip=0&Take=500`;
  const { data, isLoading, isError } = useQueryGet<GetLoggedInPlaylistDataResponse>({
    url: `/api/playlists/GetLoggedInPlaylistData?${queryString}`,
    queryKey: [QueryKeys.PlaylistDetail, id ?? ''],
    staleTime: 60_000,
  });

  useEffect(() => {
    if (data?.name) navigation.setOptions({ title: data.name });
  }, [data?.name, navigation]);

  const filteredGames: LoggedInGame[] = useMemo(() => {
    if (!data?.games) return [];
    let result = data.games;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }
    if (hideInProgress) {
      result = result.filter((g) => {
        const earned = g.achievementsEarnedSoftcore + g.achievementsEarnedHardcore;
        // hide games that ARE in progress (earned > 0 but no award)
        return !(earned > 0 && !g.highestAward);
      });
    }
    if (hideBeaten) {
      // hide games with BeatenSoftcore(1) or BeatenHardcore(2)
      result = result.filter((g) => g.highestAward !== 1 && g.highestAward !== 2);
    }
    if (hideCompleted) {
      // hide games with Completed(3) or Mastered(4)
      result = result.filter((g) => g.highestAward !== 3 && g.highestAward !== 4);
    }
    return result.map(mapToLoggedInGame);
  }, [data?.games, searchTerm, hideInProgress, hideBeaten, hideCompleted]);

  if (isLoading) {
    return (
      <View style={gameListStyles.empty}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={gameListStyles.empty}>
        <Text style={gameListStyles.emptyText}>Failed to load playlist</Text>
      </View>
    );
  }

  const totalEarned = data.totalAchievementsEarnedSoftcore + data.totalAchievementsEarnedHardcore;

  const header = (
    <View style={{ paddingHorizontal: 12, gap: 6 }}>
      {/* Stats bar */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        <View style={[gameListStyles.filterChip, { backgroundColor: '#25262b', borderColor: '#373A40', paddingHorizontal: 10 }]}>
          <Text style={gameListStyles.filterChipText}>{data.numberOfGames} games</Text>
        </View>
        <View style={[gameListStyles.filterChip, { backgroundColor: '#25262b', borderColor: '#373A40', paddingHorizontal: 10 }]}>
          <Text style={gameListStyles.filterChipText}>
            🏆 {totalEarned}/{data.totalAchievementsToEarn}
          </Text>
        </View>
        <View style={[gameListStyles.filterChip, { backgroundColor: '#25262b', borderColor: '#373A40', paddingHorizontal: 10 }]}>
          <Text style={gameListStyles.filterChipText}>
            ⭐ {data.totalPointsToEarn} pts
          </Text>
        </View>
      </View>

      {/* Filter bar */}
      <TrackedGamesFilterBar
        onSearch={setSearchTerm}
        onToggleFilter={(f) => {
          if (f === 'inProgress') setHideInProgress((v) => !v);
          if (f === 'beaten') setHideBeaten((v) => !v);
          if (f === 'completed') setHideCompleted((v) => !v);
        }}
        hideInProgress={hideInProgress}
        hideBeaten={hideBeaten}
        hideCompleted={hideCompleted}
      />
    </View>
  );

  return (
    <GameList
      games={filteredGames}
      totalPages={1}
      totalCount={filteredGames.length}
      page={1}
      onPageChange={() => {}}
      ListHeaderComponent={header}
    />
  );
}
