import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConsoleCard } from '@/components/consoles/ConsoleCard';
import { ThemedView } from '@/components/themed-view';
import { useQueryGet } from '@/helpers/mutations/useQueryGet';
import { QueryKeys } from '@/helpers/QueryKeys';
import { useResponsive } from '@/hooks/useResponsive';
import { GetLoggedInNavigationDataResponse } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse';
import { consoleCompact, consoleStyles } from '@/styles/consoles';

const COMPANY_GROUPS: { label: string; type: number; icon: string }[] = [
  { label: 'Nintendo', type: 0, icon: '🟥' },
  { label: 'Sony', type: 1, icon: '🟦' },
  { label: 'Sega', type: 3, icon: '🔵' },
  { label: 'Atari', type: 2, icon: '🟧' },
  { label: 'NEC', type: 4, icon: '🔴' },
  { label: 'SNK', type: 5, icon: '⬛' },
  { label: 'Other', type: 6, icon: '⬜' },
];

export default function ConsolesScreen() {
  const insets = useSafeAreaInsets();
  const { isCompact } = useResponsive();
  const c = isCompact;
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (label: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const { data, isLoading, isError } = useQueryGet<GetLoggedInNavigationDataResponse>({
    url: '/api/Navigation/GetLoggedInNavigationData',
    queryKey: [QueryKeys.Consoles],
    staleTime: 60_000,
  });

  const groups = useMemo(() => {
    if (!data?.consoleProgressData) return [];
    return COMPANY_GROUPS
      .map((group) => ({
        ...group,
        consoles: data.consoleProgressData.filter((c) => c.consoleType === group.type),
      }))
      .filter((g) => g.consoles.length > 0);
  }, [data?.consoleProgressData]);

  if (isLoading) {
    return (
      <View style={consoleStyles.empty}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={consoleStyles.empty}>
        <Text style={consoleStyles.emptyText}>Failed to load consoles</Text>
      </View>
    );
  }

  return (
    <ThemedView style={consoleStyles.container}>
      <ScrollView
        contentContainerStyle={[
          consoleStyles.scrollContent,
          c && consoleCompact.scrollContent,
          { paddingTop: insets.top + 8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group) => {
          const collapsed = !!collapsedGroups[group.label];
          return (
          <View key={group.label} style={[consoleStyles.section, c && consoleCompact.section]}>
            <TouchableOpacity
              style={[consoleStyles.sectionHeader, c && consoleCompact.sectionHeader]}
              onPress={() => toggleGroup(group.label)}
              activeOpacity={0.6}
            >
              <Text style={consoleStyles.sectionIcon}>{group.icon}</Text>
              <Text style={[consoleStyles.sectionTitle, c && consoleCompact.sectionTitle]}>
                {group.label}
              </Text>
              <Text style={[consoleStyles.cardCount, c && consoleCompact.cardCount]}>
                ({group.consoles.length}) {collapsed ? '▶' : '▼'}
              </Text>
            </TouchableOpacity>
            {!collapsed && group.consoles.map((con) => (
              <ConsoleCard key={con.consoleId} data={con} />
            ))}
          </View>
        )})}

        {groups.length === 0 && (
          <View style={consoleStyles.empty}>
            <Text style={consoleStyles.emptyText}>No consoles found</Text>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
