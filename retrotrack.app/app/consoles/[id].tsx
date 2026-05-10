import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { GameList } from '@/components/game-list/GameList';
import { TrackedGamesFilterBar } from '@/components/game-list/TrackedGamesFilterBar';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { LoggedInGame } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse';
import { GetUserProgressForConsoleResponse, LoggedInConsoleGame } from '@/interfaces/api/games/GetUserProgressForConsoleResponse';
import { gameListStyles } from '@/styles/gameList';

const PAGE_SIZE = 25;

function toLoggedInGame(g: LoggedInConsoleGame): LoggedInGame {
  return {
    gameId: g.gameId,
    gameTitle: g.gameTitle,
    gameGenre: g.gameGenre,
    achievementCount: g.achievementCount,
    achievementsUnlocked: g.achievementsUnlocked,
    percentageComplete: g.percentageComplete,
    playerCount: g.playerCount,
    gameImageUrl: g.gameImageUrl,
    points: g.points,
    consoleName: g.consoleName,
    highestAward: g.highestAward ?? 0,
    medianTimeToBeatHardcoreSeconds: g.medianTimeToBeatHardcoreSeconds,
    medianTimeToBeatHardcoreFormatted: g.medianTimeToBeatHardcoreFormatted,
    medianTimeToMasterSeconds: g.medianTimeToMasterSeconds,
    medianTimeToMasterFormatted: g.medianTimeToMasterFormatted,
  };
}

export default function ConsoleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [hideInProgress, setHideInProgress] = useState(false);
  const [hideBeaten, setHideBeaten] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);

  const toggleFilter = (filter: 'inProgress' | 'beaten' | 'completed') => {
    if (filter === 'inProgress') setHideInProgress((v) => !v);
    if (filter === 'beaten') setHideBeaten((v) => !v);
    if (filter === 'completed') setHideCompleted((v) => !v);
    setPage(1);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const skip = (page - 1) * PAGE_SIZE;
  let queryString = `ConsoleId=${id}&Skip=${skip}&Take=${PAGE_SIZE}&SortByName=true`;
  if (searchTerm.trim()) queryString += `&SearchType=0&SearchTerm=${encodeURIComponent(searchTerm.trim())}`;
  if (hideInProgress) queryString += '&HideInProgressGames=true';
  if (hideBeaten) queryString += '&HideBeatenGames=true';
  if (hideCompleted) queryString += '&HideCompletedGames=true';

  const { data, isLoading } = useQueryGet<GetUserProgressForConsoleResponse>({
    url: `/api/games/GetUserProgressForConsole?${queryString}`,
    queryKey: [QueryKeys.ConsoleDetail, queryString],
    staleTime: 30_000,
  });

  useEffect(() => {
    if (data?.consoleName) navigation.setOptions({ title: data.consoleName });
  }, [data?.consoleName, navigation]);

  const games: LoggedInGame[] = useMemo(
    () => (data?.games ?? []).map(toLoggedInGame),
    [data?.games],
  );

  const header = (
    <TrackedGamesFilterBar
      onSearch={handleSearch}
      onToggleFilter={toggleFilter}
      hideInProgress={hideInProgress}
      hideBeaten={hideBeaten}
      hideCompleted={hideCompleted}
    />
  );

  if (isLoading && !data) {
    return (
      <View style={gameListStyles.empty}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <GameList
      games={games}
      totalPages={data?.totalPages ?? 1}
      totalCount={data?.totalCount ?? 0}
      page={page}
      onPageChange={setPage}
      ListHeaderComponent={header}
    />
  );
}
