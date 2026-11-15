import { useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
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

type PlaylistRow = {
  id: string;
  name: string;
  numberOfGames: number;
  containsGame: boolean;
};

const GENERIC_ERROR = 'Something went wrong, please try again.';

// The API returns the reason as a plain string body on a 400
function getErrorMessage(res: AxiosResponse) {
  if (typeof res.data === 'string' && res.data.length > 0) {
    return res.data;
  }

  return GENERIC_ERROR;
}

export function GameActions({ gameId, gameTracked, playlistsWithoutGame }: Props) {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [trackPending, setTrackPending] = useState(false);
  const [playlistSheetOpen, setPlaylistSheetOpen] = useState(false);
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);

  const { data: myPlaylists, isLoading: playlistsLoading } = useQueryGet<GetPlaylistResponse>({
    url: '/api/playlists/GetUserPlaylists',
    queryKey: [QueryKeys.Playlists, 'mine', ''],
    staleTime: 30_000,
    enabled: playlistSheetOpen,
  });

  // A playlist contains the game if it isn't in the "playlists without this game" list
  const playlistRows: PlaylistRow[] = useMemo(() => {
    const playlistIdsWithoutGame = new Set(playlistsWithoutGame.map((playlist) => playlist.id));
    const allPlaylists = myPlaylists?.playlists ?? [];

    return allPlaylists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      numberOfGames: playlist.numberOfGames,
      containsGame: !playlistIdsWithoutGame.has(playlist.id),
    }));
  }, [myPlaylists?.playlists, playlistsWithoutGame]);

  const refreshQueries = async (keys: QueryKeys[]) => {
    const refreshes = keys.map((key) => queryClient.invalidateQueries({ queryKey: [key] }));

    await Promise.all(refreshes);
  };

  const toggleTracked = async () => {
    setTrackPending(true);

    try {
      let res: AxiosResponse;

      if (gameTracked) {
        res = await authApiClient.delete(`/api/trackedgames/DeleteTrackedGame/${gameId}`);
      } else {
        res = await authApiClient.post(`/api/trackedgames/AddTrackedGame/${gameId}`);
      }

      if (res.status >= 400) {
        Alert.alert('Tracked Games', getErrorMessage(res));
        return;
      }

      await refreshQueries([QueryKeys.GameDetail, QueryKeys.TrackedGames, QueryKeys.MobileHomeData]);
    } catch {
      Alert.alert('Tracked Games', GENERIC_ERROR);
    } finally {
      setTrackPending(false);
    }
  };

  const togglePlaylist = async (playlist: PlaylistRow) => {
    setPendingPlaylistId(playlist.id);

    try {
      let res: AxiosResponse;

      if (playlist.containsGame) {
        res = await authApiClient.delete('/api/playlists/RemoveGamesFromPlaylist', {
          data: { playlistId: playlist.id, gameIds: [gameId] },
        });
      } else {
        res = await authApiClient.post('/api/playlists/AddGameToPlaylist', {
          playlistId: playlist.id,
          gameId,
        });
      }

      if (res.status >= 400) {
        Alert.alert('Playlists', getErrorMessage(res));
        return;
      }

      await refreshQueries([QueryKeys.GameDetail, QueryKeys.Playlists, QueryKeys.PlaylistDetail]);
    } catch {
      Alert.alert('Playlists', GENERIC_ERROR);
    } finally {
      setPendingPlaylistId(null);
    }
  };

  const renderTrackButtonContent = () => {
    if (trackPending) {
      return <ActivityIndicator size="small" color="#fff" />;
    }

    const label = gameTracked ? '★ Tracked' : '☆ Track Game';

    return <Text style={gamePageStyles.actionButtonText}>{label}</Text>;
  };

  const renderPlaylistStatus = (playlist: PlaylistRow) => {
    if (pendingPlaylistId === playlist.id) {
      return <ActivityIndicator size="small" color="#1976d2" />;
    }

    return (
      <View style={[gamePageStyles.sheetCheck, playlist.containsGame && gamePageStyles.sheetCheckActive]}>
        {playlist.containsGame && <Text style={gamePageStyles.sheetCheckText}>✓</Text>}
      </View>
    );
  };

  const renderPlaylistList = () => {
    if (playlistsLoading) {
      return <ActivityIndicator style={{ marginVertical: 24 }} size="large" color="#1976d2" />;
    }

    if (playlistRows.length === 0) {
      return (
        <Text style={gamePageStyles.sheetEmpty}>
          You don&apos;t have any playlists yet. Create one on the Playlists tab.
        </Text>
      );
    }

    return (
      <ScrollView style={{ maxHeight: 360 }}>
        {playlistRows.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            style={gamePageStyles.sheetRow}
            activeOpacity={0.7}
            disabled={pendingPlaylistId !== null}
            onPress={() => togglePlaylist(playlist)}
          >
            <View style={{ flex: 1 }}>
              <Text style={gamePageStyles.sheetRowTitle} numberOfLines={1}>
                {playlist.name}
              </Text>
              <Text style={gamePageStyles.sheetRowMeta}>{playlist.numberOfGames} games</Text>
            </View>

            {renderPlaylistStatus(playlist)}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const closePlaylistSheet = () => setPlaylistSheetOpen(false);

  return (
    <>
      <View style={gamePageStyles.actionsRow}>
        <TouchableOpacity
          style={[gamePageStyles.actionButton, gameTracked && gamePageStyles.actionButtonActive]}
          activeOpacity={0.7}
          onPress={toggleTracked}
          disabled={trackPending}
        >
          {renderTrackButtonContent()}
        </TouchableOpacity>

        <TouchableOpacity
          style={gamePageStyles.actionButton}
          activeOpacity={0.7}
          onPress={() => setPlaylistSheetOpen(true)}
        >
          <Text style={gamePageStyles.actionButtonText}>📋 Playlists</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={playlistSheetOpen} transparent animationType="slide" onRequestClose={closePlaylistSheet}>
        <Pressable style={gamePageStyles.sheetBackdrop} onPress={closePlaylistSheet} />

        <View style={[gamePageStyles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={gamePageStyles.sheetHandle} />
          <Text style={gamePageStyles.sheetTitle}>Add to playlist</Text>
          <Text style={gamePageStyles.sheetSubtitle}>Tap a playlist to add or remove this game</Text>

          {renderPlaylistList()}

          <TouchableOpacity style={gamePageStyles.sheetDone} onPress={closePlaylistSheet}>
            <Text style={gamePageStyles.actionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
