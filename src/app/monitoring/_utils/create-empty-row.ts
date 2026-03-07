import { AttendanceRow } from '@/types';

export const createEmptyRow = (): AttendanceRow => ({
  date: '',
  day: '',
  sched: '',
  timeIn: '',
  timeOut: '',
  destination: '',
  remarks: '',
});

export const createEmptyGroup = () => [createEmptyRow()];
