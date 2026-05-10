import { useRef, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { authApiClient } from '@/helpers/apiClient';
import { QueryKeys } from '@/helpers/QueryKeys';

type UpdateState = 'idle' | 'requesting' | 'processing' | 'done';

export function useProfileUpdate() {
  const [state, setState] = useState<UpdateState>('idle');
  const queryClient = useQueryClient();
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    setState('idle');
  };

  const requestUpdate = useCallback(async () => {
    setState('requesting');

    try {
      const res = await authApiClient.post('/api/users/UpdateUserGames');

      if (res.status !== 200 || !res.data?.success) {
        const reason = res.data?.reason || 'Update request failed';
        Alert.alert('Update Failed', reason);
        setState('idle');
        return;
      }

      // Start polling for completion
      setState('processing');

      intervalRef.current = setInterval(async () => {
        try {
          const checkRes = await authApiClient.get('/api/users/CheckUserUpdateProcessingState');

          if (checkRes.data === true) {
            cleanup();
            queryClient.invalidateQueries({ queryKey: [QueryKeys.UserProfile] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.Consoles] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.MobileHomeData] });
            queryClient.invalidateQueries({ queryKey: [QueryKeys.TrackedGames] });
            Alert.alert('Update Complete', 'Your profile has been updated!');
          }
        } catch {
          // Keep polling on error
        }
      }, 3000);

      // Safety timeout after 5 minutes
      setTimeout(() => {
        if (intervalRef.current) {
          cleanup();
          Alert.alert('Update Timeout', 'The update is taking longer than expected. Check back shortly.');
        }
      }, 300_000);

    } catch {
      Alert.alert('Error', 'Failed to request update. Please try again.');
      setState('idle');
    }
  }, [queryClient]);

  return {
    requestUpdate,
    isUpdating: state === 'requesting' || state === 'processing',
    isProcessing: state === 'processing',
  };
}
