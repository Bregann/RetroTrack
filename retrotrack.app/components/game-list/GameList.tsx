import { useRouter } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useResponsive } from '@/hooks/useResponsive';
import { LoggedInGame } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse';
import { gameListCompact, gameListStyles } from '@/styles/gameList';
import { GameListCard } from './GameListCard';

type Props = {
  games: LoggedInGame[];
  totalPages: number;
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  refreshing?: boolean;
  onRefresh?: () => void;
  ListHeaderComponent?: React.ReactElement | null;
};

export function GameList({
  games,
  totalPages,
  totalCount,
  page,
  onPageChange,
  refreshing,
  onRefresh,
  ListHeaderComponent,
}: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const c = isCompact;

  const handleGamePress = (gameId: number) => {
    router.navigate('/game/' + gameId as any);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={games}
        keyExtractor={(item) => item.gameId.toString()}
        renderItem={({ item }) => (
          <GameListCard game={item} onPress={handleGamePress} />
        )}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={[gameListStyles.pagination, { paddingBottom: insets.bottom + 8 }]}>
              <TouchableOpacity
                style={[gameListStyles.pageButton, c && gameListCompact.pageButton, page <= 1 && gameListStyles.pageButtonDisabled]}
                onPress={() => onPageChange(page - 1)}
                disabled={page <= 1}
              >
                <Text style={[gameListStyles.pageButtonText, c && gameListCompact.pageButtonText]}>Previous</Text>
              </TouchableOpacity>

              <Text style={[gameListStyles.pageInfo, c && gameListCompact.pageInfo]}>
                {page} / {totalPages}
              </Text>

              <TouchableOpacity
                style={[gameListStyles.pageButton, c && gameListCompact.pageButton, page >= totalPages && gameListStyles.pageButtonDisabled]}
                onPress={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
              >
                <Text style={[gameListStyles.pageButtonText, c && gameListCompact.pageButtonText]}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={gameListStyles.empty}>
            <Text style={gameListStyles.emptyText}>No games found</Text>
          </View>
        }
      />
    </ThemedView>
  );
}
