import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AchievementSearchCard } from '@/components/search/AchievementSearchCard';
import { GameSearchCard } from '@/components/search/GameSearchCard';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useResponsive } from '@/hooks/useResponsive';
import { DoSearchResponse, GetSearchConsolesResponse } from '@/interfaces/api/search/DoSearchResponse';
import { searchCompact, searchStyles } from '@/styles/search';

const ORDER_OPTIONS = [
  { label: 'A–Z', value: 0 },
  { label: 'Z–A', value: 1 },
  { label: 'Most Achievements', value: 3 },
  { label: 'Most Points', value: 5 },
  { label: 'Recently Added', value: 6 },
];

const PAGE_SIZE = 25;

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const c = isCompact;

  const [searchText, setSearchText] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [consoleId, setConsoleId] = useState(-1);
  const [orderBy, setOrderBy] = useState(0);
  const [page, setPage] = useState(1);
  const [showConsolePicker, setShowConsolePicker] = useState(false);
  const [showOrderPicker, setShowOrderPicker] = useState(false);
  const [tab, setTab] = useState<'games' | 'achievements'>('games');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setActiveSearch(text);
      setPage(1);
    }, 300);
  };

  const { data: consolesData } = useQueryGet<GetSearchConsolesResponse>({
    url: '/api/Search/GetSearchConsoles',
    queryKey: [QueryKeys.SearchConsoles],
    staleTime: 300_000,
  });

  const skip = (page - 1) * PAGE_SIZE;
  const queryString = activeSearch.trim()
    ? `SearchTerm=${encodeURIComponent(activeSearch.trim())}&OrderBy=${orderBy}&ConsoleId=${consoleId}&Skip=${skip}&Take=${PAGE_SIZE}`
    : '';

  const { data, isLoading } = useQueryGet<DoSearchResponse>({
    url: `/api/Search/DoSearch?${queryString}`,
    queryKey: [QueryKeys.Search, queryString],
    staleTime: 30_000,
    enabled: activeSearch.trim().length > 0,
  });

  const selectedConsole = consolesData?.consoles.find((c) => c.id === consoleId);
  const selectedOrder = ORDER_OPTIONS.find((o) => o.value === orderBy);

  // ---- Dropdown helper ----
  const DropdownPicker = ({ title, value, options, onSelect, visible, onClose }: {
    title: string;
    value: string;
    options: { label: string; value: number }[];
    onSelect: (v: number) => void;
    visible: boolean;
    onClose: () => void;
  }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={searchStyles.dropdownOverlay} activeOpacity={1} onPress={onClose}>
        <View style={searchStyles.dropdownList}>
          <ScrollView>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={searchStyles.dropdownItem}
                onPress={() => { onSelect(opt.value); onClose(); }}
              >
                <Text style={[searchStyles.dropdownItemText, opt.value === (options === ORDER_OPTIONS ? orderBy : consoleId) && searchStyles.dropdownItemActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  // ---- Header ----
  const header = (
    <View>
      <TextInput
        style={[searchStyles.searchInput, c && searchCompact.searchInput]}
        placeholder="Search games & achievements..."
        placeholderTextColor="#909296"
        value={searchText}
        onChangeText={handleSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={searchStyles.filterRow}>
        <TouchableOpacity style={searchStyles.filterDropdown} onPress={() => setShowConsolePicker(true)}>
          <View>
            <Text style={searchStyles.filterLabel}>Console</Text>
            <Text style={searchStyles.filterText}>{selectedConsole?.name ?? 'All Consoles'}</Text>
          </View>
          <Text style={{ color: '#909296' }}>▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={searchStyles.filterDropdown} onPress={() => setShowOrderPicker(true)}>
          <View>
            <Text style={searchStyles.filterLabel}>Sort</Text>
            <Text style={searchStyles.filterText}>{selectedOrder?.label ?? 'A–Z'}</Text>
          </View>
          <Text style={{ color: '#909296' }}>▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ---- Results ----
  const gameTotal = data?.totalGameResults ?? 0;
  const achievementTotal = data?.totalAchievementResults ?? 0;
  const totalForPage = tab === 'games' ? gameTotal : achievementTotal;
  const totalPages = Math.max(1, Math.ceil(totalForPage / PAGE_SIZE));
  const results = tab === 'games'
    ? (data?.gameResults ?? [])
    : (data?.achievementResults ?? []);

  const footer = totalPages > 1 && activeSearch.trim() ? (
    <View style={[searchStyles.pagination, { paddingBottom: insets.bottom + 8 }]}>
      <TouchableOpacity
        style={[searchStyles.pageButton, page <= 1 && searchStyles.pageButtonDisabled]}
        onPress={() => setPage((p) => p - 1)}
        disabled={page <= 1}
      >
        <Text style={searchStyles.pageButtonText}>Previous</Text>
      </TouchableOpacity>
      <Text style={searchStyles.pageInfo}>{page} / {totalPages}</Text>
      <TouchableOpacity
        style={[searchStyles.pageButton, page >= totalPages && searchStyles.pageButtonDisabled]}
        onPress={() => setPage((p) => p + 1)}
        disabled={page >= totalPages}
      >
        <Text style={searchStyles.pageButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  ) : null;

  return (
    <ThemedView style={searchStyles.container}>
      <FlatList
        data={results as any[]}
        keyExtractor={(item: any, i) => (tab === 'games' ? `g${item.gameId}` : `a${item.achievementId}`)}
        renderItem={({ item }: any) =>
          tab === 'games'
            ? <GameSearchCard result={item} />
            : <AchievementSearchCard result={item} />
        }
        contentContainerStyle={[
          searchStyles.scrollContent,
          c && searchCompact.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {header}
            {activeSearch.trim() ? (
              <View style={[searchStyles.tabRow, c && searchCompact.tabRow]}>
                <TouchableOpacity
                  style={[searchStyles.tab, c && searchCompact.tab, tab === 'games' && searchStyles.tabActive]}
                  onPress={() => { setTab('games'); setPage(1); }}
                >
                  <Text style={[searchStyles.tabText, c && searchCompact.tabText, tab === 'games' && searchStyles.tabTextActive]}>Games</Text>
                  <View style={searchStyles.tabBadge}>
                    <Text style={searchStyles.tabBadgeText}>{gameTotal}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[searchStyles.tab, c && searchCompact.tab, tab === 'achievements' && searchStyles.tabActive]}
                  onPress={() => { setTab('achievements'); setPage(1); }}
                >
                  <Text style={[searchStyles.tabText, c && searchCompact.tabText, tab === 'achievements' && searchStyles.tabTextActive]}>Achievements</Text>
                  <View style={searchStyles.tabBadge}>
                    <Text style={searchStyles.tabBadgeText}>{achievementTotal}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            {isLoading && activeSearch.trim() ? (
              <View style={searchStyles.empty}>
                <ActivityIndicator size="large" color="#1976d2" />
              </View>
            ) : null}
            {!isLoading && activeSearch.trim() && results.length === 0 ? (
              <View style={searchStyles.empty}>
                <Text style={searchStyles.emptyText}>No results found</Text>
              </View>
            ) : null}
          </>
        }
        ListFooterComponent={footer}
        ListEmptyComponent={
          !activeSearch.trim() ? (
            <View style={searchStyles.empty}>
              <Text style={searchStyles.emptyText}>Search for games and achievements</Text>
            </View>
          ) : null
        }
      />

      {/* Dropdown pickers */}
      <DropdownPicker
        title="Console"
        value={selectedConsole?.name ?? 'All Consoles'}
        options={consolesData?.consoles.map(c => ({ label: c.name, value: c.id })) ?? []}
        onSelect={(v) => { setConsoleId(v); setPage(1); }}
        visible={showConsolePicker}
        onClose={() => setShowConsolePicker(false)}
      />
      <DropdownPicker
        title="Sort"
        value={selectedOrder?.label ?? 'A–Z'}
        options={ORDER_OPTIONS}
        onSelect={(v) => { setOrderBy(v); setPage(1); }}
        visible={showOrderPicker}
        onClose={() => setShowOrderPicker(false)}
      />
    </ThemedView>
  );
}
