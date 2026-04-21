import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defaults';
import type { ApiLogData, AttendanceData, AttendanceDefaults } from '@/types';
import { formatDate } from '@/utils/format-date';
import { formatTimeTo12Hour } from '@/utils/format-time';
import { isRowHasRecords } from '@/utils/is-row-has-records';

export const processLogs = (
  logs: ApiLogData[],
  defaults: AttendanceDefaults = FALLBACK_ATTENDANCE_DEFAULTS,
): AttendanceData => {
  const groupedData: AttendanceData = [];

  logs.forEach((log) => {
    const isDayOff = log.Shift === 'X' || log.Remarks === 'DAY OFF';
    const hasRecords = isRowHasRecords(log);

    if (isDayOff && !hasRecords) {
      // Day off with no work — single row
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: '',
          timeOut: '',
          destination: '',
          remarks: log.Remarks,
        },
      ]);
    } else if (!hasRecords) {
      // Holiday, Absent or any other no-record day — single row
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: '',
          timeOut: '',
          destination: '',
          remarks: log.Remarks,
        },
      ]);
    } else {
      // Regular work day - create two-row group
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: formatTimeTo12Hour(log.TimeIn),
          timeOut: formatTimeTo12Hour(log.BreakOut),
          destination: defaults.destination,
          remarks: log.Remarks || defaults.remarks,
        },
        {
          date: '',
          day: '',
          sched: '',
          timeIn: formatTimeTo12Hour(log.BreakIn),
          timeOut: formatTimeTo12Hour(log.TimeOut),
          destination: defaults.destination,
          remarks: log.Remarks || defaults.remarks,
        },
      ]);
    }
  });

  // Fill remaining rows with empty data up to 40 rows
  const currentRowCount = groupedData.reduce(
    (total, group) => total + group.length,
    0,
  );
  const remainingRows = 40 - currentRowCount;
  for (let i = 0; i < remainingRows; i++) {
    groupedData.push([
      {
        date: '',
        day: '',
        sched: '',
        timeIn: '',
        timeOut: '',
        destination: '',
        remarks: '',
      },
    ]);
  }
  return groupedData;
};
