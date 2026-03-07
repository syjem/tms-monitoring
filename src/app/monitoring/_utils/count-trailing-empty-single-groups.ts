import { AttendanceData } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';

export const countTrailingEmptySingleGroups = (data: AttendanceData) => {
  let emptyGroups = 0;

  for (let i = data.length - 1; i >= 0; i--) {
    const group = data[i];

    if (group.length === 1 && isRowEmpty(group[0])) {
      emptyGroups++;
      continue;
    }

    break;
  }

  return emptyGroups;
};
