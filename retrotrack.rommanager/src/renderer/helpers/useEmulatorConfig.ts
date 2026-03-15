import { useQuery } from '@tanstack/react-query';
import { doQueryGet } from './apiClient';
import type { EmulatorConfigResponse } from '../components/emulator-settings/emulatorSettingsTypes';

export function useEmulatorConfig() {
  return useQuery<EmulatorConfigResponse>({
    queryKey: ['emulator-config'],
    queryFn: () => doQueryGet<EmulatorConfigResponse>('/api/Emulators/GetEmulatorConfig'),
    staleTime: 5 * 60 * 1000,
  });
}
