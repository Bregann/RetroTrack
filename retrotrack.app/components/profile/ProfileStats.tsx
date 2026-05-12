import { Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { profileCompact, profileStyles } from '@/styles/profile';

type Stat = { label: string; value: number; icon: string };

type Props = { stats: Stat[] };

export function ProfileStats({ stats }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <View style={[profileStyles.statsGrid, c && profileCompact.statsGrid]}>
      {stats.map((stat, i) => (
        <View key={i} style={[profileStyles.statCard, c && profileCompact.statCard]}>
          <Text style={[profileStyles.statValue, c && profileCompact.statValue]}>
            {stat.value.toLocaleString()}
          </Text>
          <Text style={profileStyles.statLabel}>
            {stat.icon} {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
