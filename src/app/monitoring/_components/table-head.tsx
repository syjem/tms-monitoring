import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function CustomTableHead() {
  return (
    <TableHeader className="text-sm">
      <TableRow className="bg-gray-100 hover:bg-bg-gray-100">
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-16">
          Date
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-8">
          Day
        </TableHead>
        <TableHead className="text-center font-semibold border border-black p-1 w-4">
          Sched
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-24">
          Time-in
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-24">
          Time-out
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-44">
          Destination
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-40">
          Remarks
        </TableHead>
        <TableHead className="text-center font-semibold border border-black py-1 px-2 w-12">
          Signature
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
