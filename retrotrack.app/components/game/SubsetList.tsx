import { Image, Text, TouchableOpacity, View } from 'react-native';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { SubsetGame } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { gamePageStyles } from '@/styles/gamePage';

type Props = {
  subsets: SubsetGame[];
};

export function SubsetList({ subsets }: Props) {
  if (subsets.length === 0) return null;

  return (
    <>
      <Text style={[gamePageStyles.sectionTitle, { marginTop: 16 }]}>Subsets</Text>
      {subsets.map((subset) => (
        <TouchableOpacity
          key={subset.gameId}
          style={gamePageStyles.subsetCard}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: getGameIconUrl(subset.gameImage) }}
            style={gamePageStyles.subsetIcon}
          />
          <View style={gamePageStyles.subsetInfo}>
            <Text style={gamePageStyles.subsetTitle} numberOfLines={1}>
              {subset.title}
            </Text>
            <Text style={gamePageStyles.subsetProgress}>
              {subset.achievementsUnlocked}/{subset.achievementCount} ·{' '}
              {subset.percentageComplete}% · {subset.points} pts
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}
