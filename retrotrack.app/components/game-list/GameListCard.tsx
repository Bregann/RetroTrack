import { Image, Text, TouchableOpacity, View } from 'react-native';

import { getGameIconUrl } from '@/helpers/mediaUrls';
import { useResponsive } from '@/hooks/useResponsive';
import { HighestAwardKind } from '@/interfaces/api/enums/HighestAwardKind';
import { LoggedInGame } from '@/interfaces/api/trackedGames/GetUserTrackedGamesResponse';
import { gameListCompact, gameListStyles } from '@/styles/gameList';
import { CONSOLE_COLORS } from '../home/consoleColors';

const AWARD_LABELS: Record<number, { text: string; color: string }> = {
  [HighestAwardKind.Mastered]: { text: 'Mastered', color: '#fab005' },
  [HighestAwardKind.Completed]: { text: 'Completed', color: '#fd7e14' },
  [HighestAwardKind.BeatenHardcore]: { text: 'Beaten HC', color: '#15aabf' },
  [HighestAwardKind.BeatenSoftcore]: { text: 'Beaten SC', color: '#12b886' },
};

type Props = {
  game: LoggedInGame;
  onPress?: (gameId: number) => void;
};

export function GameListCard({ game, onPress }: Props) {
  const award = game.highestAward !== undefined ? AWARD_LABELS[game.highestAward] : null;
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <TouchableOpacity
      style={[gameListStyles.card, c && gameListCompact.card]}
      activeOpacity={0.7}
      onPress={() => onPress?.(game.gameId)}
    >
      <Image
        source={{ uri: getGameIconUrl(game.gameImageUrl) }}
        style={[gameListStyles.icon, c && gameListCompact.icon]}
      />

      <View style={gameListStyles.info}>
        <Text style={[gameListStyles.title, c && gameListCompact.title]} numberOfLines={1}>
          {game.gameTitle}
        </Text>

        <View style={[gameListStyles.metaRow, c && gameListCompact.metaRow]}>
          {game.consoleName && (
            <View style={[gameListStyles.consoleTag, c && gameListCompact.consoleTag, { backgroundColor: CONSOLE_COLORS[0] ?? '#836d6d' }]}>
              <Text style={[gameListStyles.consoleText, c && gameListCompact.consoleText]}>{game.consoleName}</Text>
            </View>
          )}
          {award && (
            <View style={[gameListStyles.awardBadge, c && gameListCompact.awardBadge, { backgroundColor: award.color }]}>
              <Text style={[gameListStyles.awardBadgeText, c && gameListCompact.awardBadgeText]}>{award.text}</Text>
            </View>
          )}
          <Text style={[gameListStyles.stat, c && gameListCompact.stat]}>
            🏆 {game.achievementsUnlocked}/{game.achievementCount}
          </Text>
          <Text style={[gameListStyles.stat, c && gameListCompact.stat]}>
            ⭐ {game.points}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={gameListStyles.progressBar}>
          <View
            style={[
              gameListStyles.progressFill,
              {
                backgroundColor: award?.color ?? '#1976d2',
                width: `${Math.min(game.percentageComplete, 100)}%`,
              },
            ]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
