import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/context/authContext';
import { ThemeMode, useThemeMode } from '@/context/themeContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { settingsStyles } from '@/styles/settings';

const MODES: { label: string; value: ThemeMode }[] = [
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
  { label: 'System', value: 'system' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logOut } = useAuth();
  const colorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useThemeMode();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <ThemedView style={settingsStyles.container}>
      <ScrollView
        contentContainerStyle={[settingsStyles.scrollContent, { paddingTop: insets.top + 16 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[settingsStyles.header, { color: colors.text }]}>Settings</Text>

        {/* ── Appearance ── */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Appearance</Text>
          <View style={[settingsStyles.row, settingsStyles.rowSingle]}>
            <Text style={[settingsStyles.rowLabel, { color: colors.text }]}>Theme</Text>
            <View style={settingsStyles.segmentedControl}>
              {MODES.map((mode) => {
                const active = themeMode === mode.value;
                return (
                  <TouchableOpacity
                    key={mode.value}
                    style={[
                      settingsStyles.segment,
                      active && settingsStyles.segmentActive,
                    ]}
                    onPress={() => setThemeMode(mode.value)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        settingsStyles.segmentText,
                        active && settingsStyles.segmentTextActive,
                      ]}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Account ── */}
        <View style={settingsStyles.section}>
          <Text style={settingsStyles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={settingsStyles.rowDanger}
            onPress={logOut}
            activeOpacity={0.7}
          >
            <Text style={settingsStyles.rowDangerText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}
