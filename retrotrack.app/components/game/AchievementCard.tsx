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

function getUnlockText(achievement: UserAchievement) {
  if (achievement.dateEarnedHardcore) {
    return `🏆 HC ${achievement.dateEarnedHardcore}`;
  }

  if (achievement.dateEarnedSoftcore) {
    return `🥈 SC ${achievement.dateEarnedSoftcore}`;
  }

  return 'Locked';
}

export function AchievementCard({ achievement }: Props) {
  const isUnlocked = !!achievement.dateEarnedHardcore || !!achievement.dateEarnedSoftcore;
  const badgeUrl = `https://media.retroachievements.org/Badge/${achievement.badgeName}`;
  const { isCompact } = useResponsive();

  let typeInfo: (typeof ACHIEVEMENT_TYPES)[number] | undefined;

  if (achievement.type !== null) {
    typeInfo = ACHIEVEMENT_TYPES[achievement.type];
  }

  const c = isCompact;

  const openOnRetroAchievements = async () => {
    try {
      await Linking.openURL(`https://retroachievements.org/achievement/${achievement.id}`);
    } catch {
      // Nothing can handle the link; leave the user where they are
    }
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
        {!!achievement.description && (
          <Text style={[gamePageStyles.achievementDesc, c && gamePageCompact.achievementDesc]} numberOfLines={3}>
            {achievement.description}
          </Text>
        )}

        <View style={gamePageStyles.achievementMeta}>
          <Text style={[gamePageStyles.achievementDate, c && gamePageCompact.achievementDate]}>
            {getUnlockText(achievement)}
          </Text>

          {typeInfo && (
            <View style={[gamePageStyles.achievementTypeTag, { backgroundColor: typeInfo.color }]}>
              <Text style={gamePageStyles.achievementTypeTagText}>
                {typeInfo.icon} {typeInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Text style={[gamePageStyles.achievementPoints, c && gamePageCompact.achievementPoints]}>{achievement.points}</Text>
    </TouchableOpacity>
  );
}
