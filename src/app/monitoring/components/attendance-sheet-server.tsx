import { getWorkLogById } from '@/app/actions/logs/get-work-log-by-id';
import { getSignatories } from '@/app/actions/profiles/get-signatories';
import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import AttendanceSheet from '@/app/monitoring/components/attendance-sheet';

export async function AttendanceSheetServer({ id }: { id: string }) {
  const [workLog, signature, signatories] = await Promise.all([
    getWorkLogById(id),
    getEngineerSignature(),
    getSignatories(),
  ]);

  return (
    <AttendanceSheet
      workLog={workLog}
      signature={signature}
      signatories={signatories}
    />
  );
}
