import { ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Search</Text>
        <Text style={{ fontSize: 14, color: colors.secondaryText, marginTop: 8 }}>Coming soon...</Text>
      </ScrollView>
    </ThemedView>
  );
}
