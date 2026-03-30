import { getWorkLogById } from '@/app/actions/logs/get-work-log-by-id';
import { getSignatories } from '@/app/actions/profiles/get-signatories';
import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import AttendanceSheet from '@/app/monitoring/_components/attendance-sheet';
import { SignatureProvider } from '@/app/monitoring/_components/signature-context';

export async function AttendanceServer({ id }: { id: string }) {
  const [workLog, signature, signatories] = await Promise.all([
    getWorkLogById(id),
    getEngineerSignature(),
    getSignatories(),
  ]);

  return (
    <SignatureProvider signature={signature}>
      <AttendanceSheet workLog={workLog} signatories={signatories} />
    </SignatureProvider>
  );
}
