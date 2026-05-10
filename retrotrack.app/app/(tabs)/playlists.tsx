import { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useResponsive } from '@/hooks/useResponsive';
import { GetPlaylistResponse } from '@/interfaces/api/playlists/GetPlaylistResponse';
import { playlistCompact, playlistStyles } from '@/styles/playlists';

type Tab = 'mine' | 'public' | 'liked';
const TABS: { key: Tab; label: string }[] = [
  { key: 'mine', label: 'My Playlists' },
  { key: 'public', label: 'Public' },
  { key: 'liked', label: 'Liked' },
];

export default function PlaylistsScreen() {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const [tab, setTab] = useState<Tab>('mine');
  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setActiveSearch(text), 300);
  };

  const mineQuery = useQueryGet<GetPlaylistResponse>({
    url: '/api/playlists/GetUserPlaylists',
    queryKey: [QueryKeys.Playlists, 'mine', activeSearch],
    staleTime: 30_000,
    enabled: tab === 'mine',
  });

  const publicQuery = useQueryGet<GetPlaylistResponse>({
    url: '/api/playlists/GetPublicPlaylists',
    queryKey: [QueryKeys.Playlists, 'public', activeSearch],
    staleTime: 30_000,
    enabled: tab === 'public',
  });

  const likedQuery = useQueryGet<GetPlaylistResponse>({
    url: '/api/playlists/GetUserLikedPlaylists',
    queryKey: [QueryKeys.Playlists, 'liked', activeSearch],
    staleTime: 30_000,
    enabled: tab === 'liked',
  });

  const activeQuery = tab === 'mine' ? mineQuery : tab === 'public' ? publicQuery : likedQuery;
  const { data, isLoading, isError } = activeQuery;

  const filteredPlaylists = useMemo(() => {
    if (!data?.playlists) return [];
    if (!activeSearch.trim()) return data.playlists;
    const q = activeSearch.toLowerCase();
    return data.playlists.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.createdBy.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)),
    );
  }, [data?.playlists, activeSearch]);

  const c = isCompact;

  return (
    <ThemedView style={playlistStyles.container}>
      <ScrollView
        contentContainerStyle={[
          playlistStyles.scrollContent,
          c && playlistCompact.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab bar */}
        <View style={[playlistStyles.tabRow, c && playlistCompact.tabRow]}>
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                style={[playlistStyles.tab, c && playlistCompact.tab, active && playlistStyles.tabActive]}
                onPress={() => { setTab(t.key); setSearchText(''); setActiveSearch(''); }}
              >
                <Text style={[playlistStyles.tabText, c && playlistCompact.tabText, active && playlistStyles.tabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search */}
        <TextInput
          style={[playlistStyles.searchInput, c && playlistCompact.searchInput]}
          placeholder="Search playlists..."
          placeholderTextColor="#909296"
          value={searchText}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Content */}
        {isLoading ? (
          <View style={playlistStyles.empty}>
            <ActivityIndicator size="large" color="#1976d2" />
          </View>
        ) : isError ? (
          <View style={playlistStyles.empty}>
            <Text style={playlistStyles.emptyText}>Failed to load playlists</Text>
          </View>
        ) : filteredPlaylists.length === 0 ? (
          <View style={playlistStyles.empty}>
            <Text style={[playlistStyles.emptyText, c && playlistCompact.emptyText]}>
              {activeSearch ? 'No matching playlists' : 'No playlists found'}
            </Text>
          </View>
        ) : (
          filteredPlaylists.map((p) => <PlaylistCard key={p.id} playlist={p} />)
        )}
      </ScrollView>
    </ThemedView>
  );
}
