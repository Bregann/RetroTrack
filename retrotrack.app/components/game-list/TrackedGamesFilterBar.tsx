import { useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { gameListCompact, gameListStyles } from '@/styles/gameList';

type Props = {
  onSearch: (term: string) => void;
  onToggleFilter: (filter: 'inProgress' | 'beaten' | 'completed') => void;
  hideInProgress: boolean;
  hideBeaten: boolean;
  hideCompleted: boolean;
};

export function TrackedGamesFilterBar({
  onSearch,
  onToggleFilter,
  hideInProgress,
  hideBeaten,
  hideCompleted,
}: Props) {
  const [searchText, setSearchText] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const { isCompact } = useResponsive();
  const c = isCompact;

  const handleChange = (text: string) => {
    setSearchText(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(text);
    }, 300);
  };

  return (
    <View style={[gameListStyles.filterContainer, c && gameListCompact.filterContainer]}>
      <TextInput
        style={[gameListStyles.searchInput, c && gameListCompact.searchInput]}
        placeholder="Search games..."
        placeholderTextColor="#909296"
        value={searchText}
        onChangeText={handleChange}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={gameListStyles.filterToggles}>
        <TouchableOpacity
          style={[gameListStyles.filterChip, c && gameListCompact.filterChip, hideInProgress && gameListStyles.filterChipActive]}
          onPress={() => onToggleFilter('inProgress')}
        >
          <Text style={[gameListStyles.filterChipText, c && gameListCompact.filterChipText, hideInProgress && gameListStyles.filterChipTextActive]}>
            Hide In Progress
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[gameListStyles.filterChip, c && gameListCompact.filterChip, hideBeaten && gameListStyles.filterChipActive]}
          onPress={() => onToggleFilter('beaten')}
        >
          <Text style={[gameListStyles.filterChipText, c && gameListCompact.filterChipText, hideBeaten && gameListStyles.filterChipTextActive]}>
            Hide Beaten
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[gameListStyles.filterChip, c && gameListCompact.filterChip, hideCompleted && gameListStyles.filterChipActive]}
          onPress={() => onToggleFilter('completed')}
        >
          <Text style={[gameListStyles.filterChipText, c && gameListCompact.filterChipText, hideCompleted && gameListStyles.filterChipTextActive]}>
            Hide Completed
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
