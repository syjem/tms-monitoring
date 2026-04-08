'use client';

import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { queryOptions, useQuery } from '@tanstack/react-query';

export const WORK_LOGS_QUERY_KEY = ['work-logs'] as const;

export function getWorkLogsQueryOptions() {
  return queryOptions({
    queryFn: () => getWorkLogs(),
    queryKey: WORK_LOGS_QUERY_KEY,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });
}

export function useWorkLogs(enabled = true) {
  const query = useQuery({
    ...getWorkLogsQueryOptions(),
    enabled,
  });

  return {
    ...query,
    logs: query.data ?? [],
  };
}
