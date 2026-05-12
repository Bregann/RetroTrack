import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useResponsive } from '@/hooks/useResponsive';
import { ConsoleProgressData } from '@/interfaces/api/navigation/GetLoggedInNavigationDataResponse';
import { consoleCompact, consoleStyles } from '@/styles/consoles';

type Props = {
  data: ConsoleProgressData;
};

const PROGRESS_ITEMS: { key: keyof ConsoleProgressData; label: string; color: string }[] = [
  { key: 'gamesBeatenHardcore', label: 'Beaten HC', color: '#15aabf' },
  { key: 'gamesMastered', label: 'Mastered', color: '#fab005' },
  { key: 'gamesBeatenSoftcore', label: 'Beaten SC', color: '#12b886' },
  { key: 'gamesCompleted', label: 'Completed', color: '#fd7e14' },
];

export function ConsoleCard({ data }: Props) {
  const router = useRouter();
  const { isCompact } = useResponsive();
  const c = isCompact;

  const maxGames = data.totalGamesInConsole || 1;

  return (
    <TouchableOpacity
      style={[consoleStyles.card, c && consoleCompact.card]}
      activeOpacity={0.7}
      onPress={() => router.navigate('/consoles/' + data.consoleId as any)}
    >
      <View style={consoleStyles.cardHeader}>
        <Text style={[consoleStyles.cardTitle, c && consoleCompact.cardTitle]}>
          {data.consoleName}
        </Text>
        <Text style={[consoleStyles.cardCount, c && consoleCompact.cardCount]}>
          {data.totalGamesInConsole} games
        </Text>
      </View>

      <View style={consoleStyles.progressRow}>
        {PROGRESS_ITEMS.map((item) => {
          const count = data[item.key] as number;
          if (count === 0) return null;
          const pct = maxGames > 0 ? (count / maxGames) * 100 : 0;
          return (
            <View key={item.key} style={consoleStyles.progressItem}>
              <Text style={[consoleStyles.progressLabel, c && consoleCompact.progressLabel]}>
                {item.label}
              </Text>
              <View style={[consoleStyles.progressBar, c && consoleCompact.progressBar]}>
                <View
                  style={[
                    consoleStyles.progressFill,
                    c && consoleCompact.progressFill,
                    { backgroundColor: item.color, width: `${Math.min(pct, 100)}%` },
                  ]}
                />
              </View>
              <Text style={[consoleStyles.progressValue, c && consoleCompact.progressValue]}>
                {count}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}
