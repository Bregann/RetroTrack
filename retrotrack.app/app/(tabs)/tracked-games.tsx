import { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { GameList } from '@/components/game-list/GameList';
import { TrackedGamesFilterBar } from '@/components/game-list/TrackedGamesFilterBar';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { GetUserTrackedGamesResponse } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse';
import { gameListStyles } from '@/styles/gameList';

const PAGE_SIZE = 25;

export default function TrackedGamesScreen() {
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
  let queryString = `Skip=${skip}&Take=${PAGE_SIZE}&SortByName=true`;
  if (searchTerm.trim()) queryString += `&SearchType=0&SearchTerm=${encodeURIComponent(searchTerm.trim())}`;
  if (hideInProgress) queryString += '&HideInProgressGames=true';
  if (hideBeaten) queryString += '&HideBeatenGames=true';
  if (hideCompleted) queryString += '&HideCompletedGames=true';

  const { data, isLoading } = useQueryGet<GetUserTrackedGamesResponse>({
    url: `/api/trackedgames/GetTrackedGamesForUser?${queryString}`,
    queryKey: [QueryKeys.TrackedGames, queryString],
    staleTime: 30_000,
  });

  const header = useMemo(() => (
    <TrackedGamesFilterBar
      onSearch={handleSearch}
      onToggleFilter={toggleFilter}
      hideInProgress={hideInProgress}
      hideBeaten={hideBeaten}
      hideCompleted={hideCompleted}
    />
  ), [hideInProgress, hideBeaten, hideCompleted]);

  if (isLoading && !data) {
    return (
      <View style={gameListStyles.empty}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <GameList
      games={data?.games ?? []}
      totalPages={data?.totalPages ?? 1}
      totalCount={data?.totalCount ?? 0}
      page={page}
      onPageChange={setPage}
      ListHeaderComponent={header}
    />
  );
}
