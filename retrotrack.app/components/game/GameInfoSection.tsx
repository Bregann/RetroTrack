import { Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

type InfoRow = { label: string; value: string };

type Props = {
  details: InfoRow[];
};

export function GameInfoSection({ details }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <>
      <Text style={[gamePageStyles.sectionTitle, c && gamePageCompact.sectionTitle]}>
        Game Details
      </Text>
      {details.map((d, i) => (
        <View key={i} style={[gamePageStyles.infoRow, c && gamePageCompact.infoRow]}>
          <Text style={[gamePageStyles.infoLabel, c && gamePageCompact.infoLabel]}>
            {d.label}
          </Text>
          <Text style={[gamePageStyles.infoValue, c && gamePageCompact.infoValue]}>
            {d.value}
          </Text>
        </View>
      ))}
    </>
  );
}
