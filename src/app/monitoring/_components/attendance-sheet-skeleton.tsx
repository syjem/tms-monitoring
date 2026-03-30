import { AttendanceSheetHeader } from '@/app/monitoring/_components/attendance-sheet-header';
import { CustomTableHead } from '@/app/monitoring/_components/table-head';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export function AttendanceSheetSkeleton() {
  return (
    <div className="min-h-screen bg-white px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AttendanceSheetHeader />
      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <Table>
          <CustomTableHead />
          <TableBody>
            {Array.from({ length: 40 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
                <TableCell className="border border-black p-0">
                  <Skeleton className="h-6 w-full bg-slate-200 rounded-none" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
