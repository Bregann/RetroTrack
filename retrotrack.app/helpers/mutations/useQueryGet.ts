import { authApiClient } from '@/helpers/apiClient';
import { useQuery } from '@tanstack/react-query';

interface QueryGetOptions<TOutput> {
  url: string;
  queryKey: string[];
  staleTime?: number;
  gcTime?: number;
  enabled?: boolean;
  onError?: (_error: Error) => void;
  onSuccess?: (_data: TOutput) => void;
}

export function useQueryGet<TOutput>(options: QueryGetOptions<TOutput>) {
  return useQuery<TOutput>({
    queryKey: options.queryKey,
    queryFn: async () => {
      const res = await authApiClient.get<TOutput>(options.url);

      if (res.status >= 400) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }

      return res.data;
    },
    staleTime: options.staleTime ?? 60_000,
    gcTime: options.gcTime,
    enabled: options.enabled,
    ...(options.onSuccess !== undefined && {
      meta: { onSuccess: options.onSuccess },
    }),
    ...(options.onError !== undefined && {
      meta: { onError: options.onError },
    }),
  });
}
