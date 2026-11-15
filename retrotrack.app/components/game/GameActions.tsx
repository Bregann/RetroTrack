import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { authApiClient } from '@/helpers/apiClient';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { UserPlaylist } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { GetPlaylistResponse } from '@/interfaces/api/playlists/GetPlaylistResponse';
import { gamePageStyles } from '@/styles/gamePage';

type Props = {
  gameId: number;
  gameTracked: boolean;
  /** The user's playlists that don't contain this game yet (from the game response) */
  playlistsWithoutGame: UserPlaylist[];
};

export function GameActions({ gameId, gameTracked, playlistsWithoutGame }: Props) {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [trackPending, setTrackPending] = useState(false);
  const [playlistSheetOpen, setPlaylistSheetOpen] = useState(false);
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);

  // All of the user's own playlists; membership is "not in playlistsWithoutGame"
  const { data: myPlaylists, isLoading: playlistsLoading } = useQueryGet<GetPlaylistResponse>({
    url: '/api/playlists/GetUserPlaylists',
    queryKey: [QueryKeys.Playlists, 'mine', ''],
    staleTime: 30_000,
    enabled: playlistSheetOpen,
  });

  const playlistRows = useMemo(() => {
    const withoutGame = new Set(playlistsWithoutGame.map((p) => p.id));
    return (myPlaylists?.playlists ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      numberOfGames: p.numberOfGames,
      containsGame: !withoutGame.has(p.id),
    }));
  }, [myPlaylists?.playlists, playlistsWithoutGame]);

  const refreshAfterChange = async (keys: QueryKeys[]) => {
    await Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })));
  };

  const toggleTracked = async () => {
    setTrackPending(true);
    try {
      const res = gameTracked
        ? await authApiClient.delete(`/api/trackedgames/DeleteTrackedGame/${gameId}`)
        : await authApiClient.post(`/api/trackedgames/AddTrackedGame/${gameId}`);

      if (res.status >= 400) {
        Alert.alert('Tracked Games', typeof res.data === 'string' && res.data ? res.data : 'Something went wrong, please try again.');
        return;
      }

      await refreshAfterChange([QueryKeys.GameDetail, QueryKeys.TrackedGames, QueryKeys.MobileHomeData]);
    } catch {
      Alert.alert('Tracked Games', 'Something went wrong, please try again.');
    } finally {
      setTrackPending(false);
    }
  };

  const togglePlaylist = async (playlistId: string, containsGame: boolean) => {
    setPendingPlaylistId(playlistId);
    try {
      const res = containsGame
        ? await authApiClient.delete('/api/playlists/RemoveGamesFromPlaylist', { data: { playlistId, gameIds: [gameId] } })
        : await authApiClient.post('/api/playlists/AddGameToPlaylist', { playlistId, gameId });

      if (res.status >= 400) {
        Alert.alert('Playlists', typeof res.data === 'string' && res.data ? res.data : 'Something went wrong, please try again.');
        return;
      }

      await refreshAfterChange([QueryKeys.GameDetail, QueryKeys.Playlists, QueryKeys.PlaylistDetail]);
    } catch {
      Alert.alert('Playlists', 'Something went wrong, please try again.');
    } finally {
      setPendingPlaylistId(null);
    }
  };

  return (
    <>
      <View style={gamePageStyles.actionsRow}>
        <TouchableOpacity
          style={[gamePageStyles.actionButton, gameTracked && gamePageStyles.actionButtonActive]}
          activeOpacity={0.7}
          onPress={toggleTracked}
          disabled={trackPending}
        >
          {trackPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={gamePageStyles.actionButtonText}>{gameTracked ? '★ Tracked' : '☆ Track Game'}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={gamePageStyles.actionButton}
          activeOpacity={0.7}
          onPress={() => setPlaylistSheetOpen(true)}
        >
          <Text style={gamePageStyles.actionButtonText}>📋 Playlists</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={playlistSheetOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPlaylistSheetOpen(false)}
      >
        <Pressable style={gamePageStyles.sheetBackdrop} onPress={() => setPlaylistSheetOpen(false)} />
        <View style={[gamePageStyles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={gamePageStyles.sheetHandle} />
          <Text style={gamePageStyles.sheetTitle}>Add to playlist</Text>
          <Text style={gamePageStyles.sheetSubtitle}>Tap a playlist to add or remove this game</Text>

          {playlistsLoading ? (
            <ActivityIndicator style={{ marginVertical: 24 }} size="large" color="#1976d2" />
          ) : playlistRows.length === 0 ? (
            <Text style={gamePageStyles.sheetEmpty}>You don&apos;t have any playlists yet. Create one on the Playlists tab.</Text>
          ) : (
            <ScrollView style={{ maxHeight: 360 }}>
              {playlistRows.map((p) => (
                <TouchableOpacity
                  key={p.id}
                  style={gamePageStyles.sheetRow}
                  activeOpacity={0.7}
                  disabled={pendingPlaylistId !== null}
                  onPress={() => togglePlaylist(p.id, p.containsGame)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={gamePageStyles.sheetRowTitle} numberOfLines={1}>{p.name}</Text>
                    <Text style={gamePageStyles.sheetRowMeta}>{p.numberOfGames} games</Text>
                  </View>
                  {pendingPlaylistId === p.id ? (
                    <ActivityIndicator size="small" color="#1976d2" />
                  ) : (
                    <View style={[gamePageStyles.sheetCheck, p.containsGame && gamePageStyles.sheetCheckActive]}>
                      {p.containsGame ? <Text style={gamePageStyles.sheetCheckText}>✓</Text> : null}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={gamePageStyles.sheetDone} onPress={() => setPlaylistSheetOpen(false)}>
            <Text style={gamePageStyles.actionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
