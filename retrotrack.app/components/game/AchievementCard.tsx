import { Image, Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { UserAchievement } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

type Props = {
  achievement: UserAchievement;
};

const ACHIEVEMENT_TYPE_LABELS: Record<number, string> = {
  0: 'Missable',
  1: 'Progression',
  2: 'Win Condition',
};

export function AchievementCard({ achievement }: Props) {
  const isUnlocked = !!achievement.dateEarnedHardcore || !!achievement.dateEarnedSoftcore;
  const earnedDate = achievement.dateEarnedHardcore || achievement.dateEarnedSoftcore;
  const badgeUrl = `https://media.retroachievements.org/Badge/${achievement.badgeName}`;
  const { isCompact } = useResponsive();
  const c = isCompact;

  return (
    <View style={[gamePageStyles.achievementCard, !isUnlocked && gamePageStyles.achievementLocked, c && gamePageCompact.achievementCard]}>
      <Image
        source={{ uri: badgeUrl }}
        style={[gamePageStyles.achievementIcon, !isUnlocked && gamePageStyles.achievementIconLocked, c && gamePageCompact.achievementIcon]}
      />
      <View style={gamePageStyles.achievementInfo}>
        <Text style={[gamePageStyles.achievementTitle, c && gamePageCompact.achievementTitle]} numberOfLines={1}>
          {achievement.title}
        </Text>
        {achievement.description ? (
          <Text style={[gamePageStyles.achievementDesc, c && gamePageCompact.achievementDesc]} numberOfLines={2}>
            {achievement.description}
          </Text>
        ) : null}
        <View style={gamePageStyles.achievementMeta}>
          {earnedDate ? (
            <Text style={[gamePageStyles.achievementDate, c && gamePageCompact.achievementDate]}>
              {achievement.dateEarnedHardcore ? '🏆 HC' : '🥈 SC'} {earnedDate}
            </Text>
          ) : (
            <Text style={[gamePageStyles.achievementDate, c && gamePageCompact.achievementDate]}>Locked</Text>
          )}
          {achievement.type !== null && ACHIEVEMENT_TYPE_LABELS[achievement.type] ? (
            <Text style={[gamePageStyles.achievementDate, c && gamePageCompact.achievementDate]}>
              · {ACHIEVEMENT_TYPE_LABELS[achievement.type]}
            </Text>
          ) : null}
        </View>
      </View>
      <Text style={[gamePageStyles.achievementPoints, c && gamePageCompact.achievementPoints]}>{achievement.points}</Text>
    </View>
  );
}
