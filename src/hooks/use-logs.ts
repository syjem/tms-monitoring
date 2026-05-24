'use client';

import { getLogs } from '@/actions/logs/get-logs';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const LOGS_QUERY_KEY = ['logs'] as const;

export function getLogsQueryOptions() {
  return queryOptions({
    queryFn: () => getLogs(),
    queryKey: LOGS_QUERY_KEY,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
}

export function useLogs(enabled = true) {
  const query = useQuery({
    ...getLogsQueryOptions(),
    enabled,
  });

  return {
    ...query,
    logs: query.data ?? [],
  };
}
