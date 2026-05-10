import { Text, TouchableOpacity, View } from 'react-native';

import { gamePageStyles } from '@/styles/gamePage';

type Props = {
  hideUnlocked: boolean;
  showProgressionOnly: boolean;
  onToggleHideUnlocked: () => void;
  onToggleProgressionOnly: () => void;
};

export function AchievementFilters({
  hideUnlocked,
  showProgressionOnly,
  onToggleHideUnlocked,
  onToggleProgressionOnly,
}: Props) {
  return (
    <View style={gamePageStyles.filterBar}>
      <TouchableOpacity
        style={[gamePageStyles.filterChip, hideUnlocked && gamePageStyles.filterChipActive]}
        onPress={onToggleHideUnlocked}
      >
        <Text
          style={[
            gamePageStyles.filterChipText,
            hideUnlocked && gamePageStyles.filterChipTextActive,
          ]}
        >
          Hide Unlocked
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          gamePageStyles.filterChip,
          showProgressionOnly && gamePageStyles.filterChipActive,
        ]}
        onPress={onToggleProgressionOnly}
      >
        <Text
          style={[
            gamePageStyles.filterChipText,
            showProgressionOnly && gamePageStyles.filterChipTextActive,
          ]}
        >
          Progression Only
        </Text>
      </TouchableOpacity>
    </View>
  );
}
