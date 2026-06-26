import { ROWS_PER_PAGE } from '@/constants/rows-per-page';
import { AttendanceData } from '@/types';
import { cloneAttendanceData } from '@/utils/logs/clone-attendance-data';
import { countRows } from '@/utils/logs/count-rows';
import { createEmptyGroup } from '@/utils/logs/create-empty-row';

export const padToFullPages = (data: AttendanceData) => {
  const cloned = cloneAttendanceData(data);
  const totalRows = countRows(cloned);

  if (totalRows === 0) {
    return Array.from({ length: ROWS_PER_PAGE }, () => createEmptyGroup());
  }

  const remainder = totalRows % ROWS_PER_PAGE;

  if (remainder === 0) return cloned;

  const rowsToAdd = ROWS_PER_PAGE - remainder;

  return [
    ...cloned,
    ...Array.from({ length: rowsToAdd }, () => createEmptyGroup()),
  ];
};
