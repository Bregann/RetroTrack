import { useQuery } from '@tanstack/react-query';
import { doQueryGet } from './apiClient';
import type { EmulatorConfigResponse } from '../components/emulator-settings/emulatorSettingsTypes';
import { QueryKeys } from './queryKeys';

export function useEmulatorConfig() {
  return useQuery<EmulatorConfigResponse>({
    queryKey: [QueryKeys.EmulatorConfig],
    queryFn: () => doQueryGet<EmulatorConfigResponse>('/api/Emulators/GetEmulatorConfig'),
    staleTime: 5 * 60 * 1000,
  });
}
