import { getLog } from '@/actions/logs/get-log';
import { getProfile } from '@/actions/profiles/get-profile';
import SheetMain from '@/app/logs/_components/sheet-main';
import { LogsSheetSkeleton } from '@/components/skeletons/logs-sheet';
import { SignatureProvider } from '@/contexts/signature';
import { getSession } from '@/lib/get-session';
import { OperationResult } from '@/utils/error-handler';
import { Suspense } from 'react';

export const metadata = {
  title: 'Monitoring Sheet',
};

function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LogsSheetSkeleton />}>
      <LogsPageContent params={params} />
    </Suspense>
  );
}

async function LogsPageContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const user = session.user;
  const { id } = await params;
  const [logs, profile] = await Promise.all([
    getLog(id, user.id),
    getProfile(user.id),
  ]);

  if (!profile.success) {
    throw new Error(profile.error.message);
  }

  const signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  > = {
    success: true,
    data: profile.data?.signature,
  };

  const signatories: OperationResult<
    {
      id: number;
      name: string;
      title: string;
      includeSignature: boolean;
    }[],
    Record<string, unknown>
  > = {
    success: true,
    data: profile.data?.signatories ?? [],
  };

  return (
    <SignatureProvider signature={signature}>
      <SheetMain logsData={logs} signatories={signatories} />
    </SignatureProvider>
  );
}

export default Page;
