import { useQuery } from '@tanstack/react-query';
import { doQueryGet } from './apiClient';
import { QueryKeys } from './queryKeys';

export interface GameDetailAchievement {
  id: number;
  title: string;
  description: string;
  points: number;
  badgeName: string;
  dateEarnedSoftcore: string | null;
  dateEarnedHardcore: string | null;
  type: number | null;
  achievementOrder: number;
}

export interface SubsetAchievement {
  id: number;
  title: string;
  description: string;
  points: number;
  badgeName: string;
  type: number | null;
  achievementOrder: number;
  dateEarnedSoftcore: string | null;
  dateEarnedHardcore: string | null;
}

export interface SubsetGame {
  gameId: number;
  title: string;
  gameImage: string;
  achievementCount: number;
  points: number;
  achievementsUnlocked?: number;
  percentageComplete?: number;
  achievements: SubsetAchievement[];
}

export interface GameDetailPlaylist {
  id: number;
  name: string;
}

export interface GameDetailData {
  gameId: number;
  title: string;
  consoleId: number;
  consoleName: string;
  gameImage: string;
  publisher: string;
  developer: string;
  imageInGame: string;
  imageTitle: string;
  imageBoxArt: string;
  genre: string;
  achievementCount: number;
  players: number;
  gameTracked: boolean;

  achievements: GameDetailAchievement[];
  achievementsAwardedSoftcore: number;
  achievementsAwardedHardcore: number;
  achievementsAwardedTotal: number;
  pointsAwardedSoftcore: number;
  pointsAwardedHardcore: number;
  pointsAwardedTotal: number;
  totalGamePoints: number;

  dateBeatenSoftcore: string | null;
  dateBeatenHardcore: string | null;
  dateCompleted: string | null;
  dateMastered: string | null;

  userNotes: string | null;

  playlists: GameDetailPlaylist[];

  medianTimeToBeatHardcoreSeconds: number | null;
  medianTimeToBeatHardcoreFormatted: string | null;
  medianTimeToMasterSeconds: number | null;
  medianTimeToMasterFormatted: string | null;
  subsets: SubsetGame[];

  lastPlayedUtc: string | null;
  totalSecondsPlayed: number;
}

export function useGameDetail(gameId: number) {
  return useQuery<GameDetailData>({
    queryKey: [QueryKeys.GameDetail, gameId],
    queryFn: () =>
      doQueryGet<GameDetailData>(
        `/api/Games/GetGameInfoForUser/${gameId}`,
      ),
    staleTime: 60 * 1000,
  });
}
