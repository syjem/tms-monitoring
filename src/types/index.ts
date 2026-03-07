export interface AttendanceRow {
  date: string;
  day: string;
  sched: string;
  timeIn: string;
  timeOut: string;
  destination: string;
  remarks: string;
}

export type AttendancePageRow = {
  groupIndex: number;
  rowIndex: number;
  row: AttendanceRow;
};

export type AttendanceGroup = AttendanceRow[];
export type AttendanceData = AttendanceGroup[]; // two dimensional array

export interface ApiLogData {
  BreakIn: string;
  BreakOut: string;
  Date: string;
  Day: string;
  Remarks: string;
  Shift: string;
  TimeIn: string;
  TimeOut: string;
}
