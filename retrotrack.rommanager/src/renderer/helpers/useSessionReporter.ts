import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { doPost } from './apiClient';
import { GAME_DETAIL_QUERY_KEY } from './useGameDetail';

/**
 * Hook that listens for game session end events from the main process
 * and reports session activity to the API.
 * Should be mounted once at the app root level.
 */
export function useSessionReporter() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = window.electron.session.onSessionEnded((data) => {
      const { gameId, sessionSeconds } = data;

      // Don't report sessions shorter than 5 seconds (likely false starts)
      if (sessionSeconds < 5) return;

      doPost(`/api/Games/UpdateGameActivity/${gameId}`, {
        body: { sessionSeconds },
      })
        .then(() => {
          // Invalidate the game detail query so hours/lastPlayed update
          queryClient.invalidateQueries({ queryKey: [GAME_DETAIL_QUERY_KEY, gameId] });
          queryClient.invalidateQueries({ queryKey: ['library-data'] });
        })
        .catch(() => {
          // API call failed — session data is lost, but don't crash
          console.error('Failed to report game session to API');
        });
    });

    return unsubscribe;
  }, [queryClient]);
}
