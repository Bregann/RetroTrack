import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { GameList } from '@/components/game-list/GameList';
import { TrackedGamesFilterBar } from '@/components/game-list/TrackedGamesFilterBar';
import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';
import { authApiClient } from '@/helpers/apiClient';
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
    highestAward: g.highestAward ?? HighestAwardKind.Unknown,
    medianTimeToBeatHardcoreSeconds: g.medianTimeToBeatHardcoreSeconds,
    medianTimeToBeatHardcoreFormatted: g.medianTimeToBeatHardcoreFormatted,
    medianTimeToMasterSeconds: g.medianTimeToMasterSeconds,
    medianTimeToMasterFormatted: g.medianTimeToMasterFormatted,
  };
}

export default function ConsoleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();
  const [randomGameLoading, setRandomGameLoading] = useState(false);
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

  let filterQuery = `ConsoleId=${id}&SortByName=true`;
  if (searchTerm.trim()) filterQuery += `&SearchType=0&SearchTerm=${encodeURIComponent(searchTerm.trim())}`;
  if (hideInProgress) filterQuery += '&HideInProgressGames=true';
  if (hideBeaten) filterQuery += '&HideBeatenGames=true';
  if (hideCompleted) filterQuery += '&HideCompletedGames=true';

  const skip = (page - 1) * PAGE_SIZE;
  const queryString = `${filterQuery}&Skip=${skip}&Take=${PAGE_SIZE}`;

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

  // Games are paged server-side, so pick a random position within the
  // filtered results and fetch just that one game
  const openRandomGame = async () => {
    const total = data?.totalCount ?? 0;
    if (total === 0 || randomGameLoading) return;

    setRandomGameLoading(true);
    try {
      const index = Math.floor(Math.random() * total);
      const res = await authApiClient.get<GetUserProgressForConsoleResponse>(
        `/api/games/GetUserProgressForConsole?${filterQuery}&Skip=${index}&Take=1`,
      );
      const game = res.data?.games?.[0];
      if (game) router.navigate(('/game/' + game.gameId) as any);
    } finally {
      setRandomGameLoading(false);
    }
  };

  const header = (
    <TrackedGamesFilterBar
      onRandomGame={(data?.totalCount ?? 0) > 0 ? openRandomGame : undefined}
      randomGameLoading={randomGameLoading}
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
