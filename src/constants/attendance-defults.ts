export const DEFAULT_DESTINATION = 'OFFICE';
export const DEFAULT_REMARKS = 'DUTY ON CALL';

export const FALLBACK_ATTENDANCE_DEFAULTS = {
  destination: DEFAULT_DESTINATION,
  remarks: DEFAULT_REMARKS,
} as const;

export type AttendanceDefaults = {
  destination: string;
  remarks: string;
};
