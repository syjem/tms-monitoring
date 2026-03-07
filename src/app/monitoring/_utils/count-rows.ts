import { AttendanceData } from '@/types';

export const countRows = (data: AttendanceData) =>
  data.reduce((total, group) => total + group.length, 0);
