'use client';

import { getDefaults } from '@/actions/profiles/get-defaults';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defults';
import { useQuery } from '@tanstack/react-query';

export function useDefaults() {
  const query = useQuery({
    queryFn: () => getDefaults(),
    queryKey: ['defaults'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const defaults = query.data ?? FALLBACK_ATTENDANCE_DEFAULTS;

  return {
    ...query,
    defaults,
  };
}
