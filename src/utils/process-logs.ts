import type { ApiLogData, AttendanceData } from '@/types';
import { formatDate } from '@/utils/format-date';
import { formatTimeTo12Hour } from '@/utils/format-time';
import { isRowHasRecords } from '@/utils/is-row-has-records';

export const processLogs = (logs: ApiLogData[]): AttendanceData => {
  const groupedData: AttendanceData = [];

  logs.forEach((log) => {
    const isDayOff = log.Shift === 'X' || log.Remarks === 'DAY OFF';
    const hasRecords = isRowHasRecords(log);

    // Check if it's a day off - create single row group
    if (isDayOff && !hasRecords) {
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
      // First row: Date, Day, Sched, TimeIn, BreakOut, Destination, Remarks, Signature
      // Second row: "", "", "", BreakIn, TimeOut, Destination, Remarks, Signature
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: formatTimeTo12Hour(log.TimeIn),
          timeOut: formatTimeTo12Hour(log.BreakOut),
          destination: 'OFFICE',
          remarks: log.Remarks || 'DUTY ON CALL',
        },
        {
          date: '',
          day: '',
          sched: '',
          timeIn: formatTimeTo12Hour(log.BreakIn),
          timeOut: formatTimeTo12Hour(log.TimeOut),
          destination: 'OFFICE',
          remarks: log.Remarks || 'DUTY ON CALL',
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
