import { Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

type Stat = { label: string; value: string; subtext?: string } | null;

type Props = {
  stats: Stat[];
};

export function GameStatsGrid({ stats }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <View style={[gamePageStyles.statsGrid, c && gamePageCompact.statsGrid]}>
      {stats.map((stat, i) =>
        stat ? (
          <View key={i} style={[gamePageStyles.statCard, c && gamePageCompact.statCard]}>
            <Text style={gamePageStyles.statLabel}>{stat.label}</Text>
            <Text style={[gamePageStyles.statValue, c && gamePageCompact.statValue]}>
              {stat.value}
            </Text>
            {stat.subtext ? (
              <Text style={gamePageStyles.statSubtext}>{stat.subtext}</Text>
            ) : null}
          </View>
        ) : null,
      )}
    </View>
  );
}
