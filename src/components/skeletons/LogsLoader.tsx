import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function LogsLoader() {
  return (
    <div className="p-6 space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] font-bold">From — To</TableHead>
            <TableHead className="font-bold">Last modified</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-38" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-46" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-10" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
