import { Text, View } from 'react-native';

import { useResponsive } from '@/hooks/useResponsive';
import { homeCompact, homeStyles } from '@/styles/home';

type Props = {
  username: string;
  trackedGamesCount: number;
  hardcorePoints: number;
  softcorePoints: number;
};

export function WelcomeHeader({ username, trackedGamesCount, hardcorePoints, softcorePoints }: Props) {
  const { isCompact } = useResponsive();

  return (
    <View style={[homeStyles.welcomeSection, isCompact && homeCompact.welcomeSection]}>
      <Text style={[homeStyles.welcomeText, isCompact && homeCompact.welcomeText]}>Welcome back, {username}!</Text>
      <Text style={[homeStyles.welcomeSubtext, isCompact && homeCompact.welcomeSubtext]}>
        {trackedGamesCount} tracked · {hardcorePoints.toLocaleString()} HC · {softcorePoints.toLocaleString()} SC
      </Text>
    </View>
  );
}
