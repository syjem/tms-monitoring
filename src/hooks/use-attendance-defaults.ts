'use client';

import { getAttendanceDefaults } from '@/app/actions/profiles/get-attendance-defaults';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defaults';
import { useQuery } from '@tanstack/react-query';

export function useAttendanceDefaults() {
  const query = useQuery({
    queryFn: () => getAttendanceDefaults(),
    queryKey: ['attendance-defaults'],
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const attendanceDefaults =
    query.data?.success && query.data.data
      ? query.data.data
      : FALLBACK_ATTENDANCE_DEFAULTS;

  return {
    ...query,
    attendanceDefaults,
  };
}
