import { AttendanceServer } from '@/app/monitoring/_components/attendance-server';
import { AttendanceSheetSkeleton } from '@/app/monitoring/_components/attendance-sheet-skeleton';
import { Suspense } from 'react';

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<AttendanceSheetSkeleton />}>
      <AttendanceServer id={id} />
    </Suspense>
  );
}

export default Page;
