import { ROWS_PER_PAGE } from '@/app/monitoring/_constants';
import { cloneAttendanceData } from '@/app/monitoring/_utils/clone-attendance-data';
import { countRows } from '@/app/monitoring/_utils/count-rows';
import { createEmptyGroup } from '@/app/monitoring/_utils/create-empty-row';
import { AttendanceData } from '@/types';

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
