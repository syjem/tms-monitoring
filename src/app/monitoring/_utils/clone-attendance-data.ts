import { AttendanceData } from '@/types';

export const cloneAttendanceData = (data: AttendanceData) =>
  data.map((group) => group.map((row) => ({ ...row })));
