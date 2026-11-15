import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { UserAchievement } from '@/interfaces/api/games/GetLoggedInSpecificGameInfoResponse';
import { gamePageCompact, gamePageStyles } from '@/styles/gamePage';

type Props = {
  achievement: UserAchievement;
};

// Matches RetroTrack.Domain.Enums.AchievementType
const ACHIEVEMENT_TYPES: Record<number, { label: string; icon: string; color: string }> = {
  0: { label: 'Missable', icon: '!', color: '#fd7e14' },
  1: { label: 'Progression', icon: '✓', color: '#15aabf' },
  2: { label: 'Win Condition', icon: '★', color: '#40c057' },
};

export function AchievementCard({ achievement }: Props) {
  const isUnlocked = !!achievement.dateEarnedHardcore || !!achievement.dateEarnedSoftcore;
  const earnedDate = achievement.dateEarnedHardcore || achievement.dateEarnedSoftcore;
  const badgeUrl = `https://media.retroachievements.org/Badge/${achievement.badgeName}`;
  const typeInfo = achievement.type !== null ? ACHIEVEMENT_TYPES[achievement.type] : undefined;
  const { isCompact } = useResponsive();
  const c = isCompact;

  const openOnRetroAchievements = () => {
    Linking.openURL(`https://retroachievements.org/achievement/${achievement.id}`).catch(() => {});
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={openOnRetroAchievements}
      style={[
        gamePageStyles.achievementCard,
        typeInfo && { borderColor: typeInfo.color, borderWidth: 2 },
        c && gamePageCompact.achievementCard,
      ]}
    >
      <Image
        source={{ uri: badgeUrl }}
        style={[gamePageStyles.achievementIcon, !isUnlocked && gamePageStyles.achievementIconLocked, c && gamePageCompact.achievementIcon]}
      />
      <View style={[gamePageStyles.achievementInfo, !isUnlocked && gamePageStyles.achievementLocked]}>
        <Text style={[gamePageStyles.achievementTitle, c && gamePageCompact.achievementTitle]} numberOfLines={2}>
          {achievement.title}
        </Text>
        {achievement.description ? (
          <Text style={[gamePageStyles.achievementDesc, c && gamePageCompact.achievementDesc]} numberOfLines={3}>
            {achievement.description}
          </Text>
        ) : null}
        <View style={gamePageStyles.achievementMeta}>
          <Text style={[gamePageStyles.achievementDate, c && gamePageCompact.achievementDate]}>
            {earnedDate ? `${achievement.dateEarnedHardcore ? '🏆 HC' : '🥈 SC'} ${earnedDate}` : 'Locked'}
          </Text>
          {typeInfo ? (
            <View style={[gamePageStyles.achievementTypeTag, { backgroundColor: typeInfo.color }]}>
              <Text style={gamePageStyles.achievementTypeTagText}>
                {typeInfo.icon} {typeInfo.label}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      <Text style={[gamePageStyles.achievementPoints, c && gamePageCompact.achievementPoints]}>{achievement.points}</Text>
    </TouchableOpacity>
  );
}
