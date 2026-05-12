import { Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { DayData } from '@/interfaces/api/games/GetRecentlyAddedAndUpdatedGamesResponse';
import { homeCompact, homeStyles } from '@/styles/home';
import { GameUpdateCard } from './GameUpdateCard';

type Props = {
  day: DayData;
};

export function DaySection({ day }: Props) {
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <View>
      <View style={[homeStyles.dateDivider, c && homeCompact.dateDivider]}>
        <View style={homeStyles.dateDividerLine} />
        <Text style={[homeStyles.dateDividerText, c && homeCompact.dateDividerText]}>{day.date}</Text>
        <View style={homeStyles.dateDividerLine} />
      </View>
      {day.newSets.length > 0 && (
        <>
          <Text style={[homeStyles.subHeader, c && homeCompact.subHeader]}>✨ New Sets</Text>
          {day.newSets.map((set) => (
            <GameUpdateCard key={set.gameId} game={set} />
          ))}
        </>
      )}
      {day.updatedSets.length > 0 && (
        <>
          <Text style={[homeStyles.subHeader, c && homeCompact.subHeader]}>🔄 Updated Sets</Text>
          {day.updatedSets.map((set) => (
            <GameUpdateCard key={set.gameId} game={set} />
          ))}
        </>
      )}
      {day.newSets.length === 0 && day.updatedSets.length === 0 && (
        <Text style={homeStyles.emptyText}>No activity this day</Text>
      )}
    </View>
  );
}
