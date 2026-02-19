import type { AttendanceRow } from '@/types';

export const isRowEmpty = (row: AttendanceRow): boolean => {
  return (
    row.date === '' &&
    row.day === '' &&
    row.sched === '' &&
    row.timeIn === '' &&
    row.timeOut === '' &&
    row.destination === '' &&
    row.remarks === ''
  );
};
