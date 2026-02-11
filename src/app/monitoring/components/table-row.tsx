import { AutoFitInput } from '@/app/monitoring/components/auto-fit-input';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { AttendanceRow } from '@/types';
import { OperationResult } from '@/utils/with-error-handler';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { SetStateAction } from 'react';

type TableRowProps = {
  groupIndex: number;
  row: AttendanceRow;
  rowIndex: number;
  isEditable: boolean;
  isHighlighted: boolean;
  isFirstRowInGroup: boolean;
  isRowNotEmpty: boolean;
  setHoveredGroup: (value: SetStateAction<number | null>) => void;
  addRowToGroup: (groupIndex: number) => void;
  updateCell: (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string,
  ) => void;
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
};

export function CustomTableRow({
  groupIndex,
  row,
  rowIndex,
  isEditable,
  isHighlighted,
  isFirstRowInGroup,
  isRowNotEmpty,
  setHoveredGroup,
  addRowToGroup,
  updateCell,
  signature,
}: TableRowProps) {
  return (
    <TableRow
      className={cn(
        'transition-colors duration-150 hover:bg-blue-100',
        isEditable && isHighlighted && 'bg-blue-100',
        !isEditable && 'hover:bg-transparent',
      )}
      onMouseEnter={() => setHoveredGroup(groupIndex)}
      onMouseLeave={() => setHoveredGroup(null)}
    >
      <TableCell className="relative border border-black p-1 print:py-0">
        {isEditable && isHighlighted && isFirstRowInGroup && isRowNotEmpty && (
          <Button
            size="sm"
            className="absolute -top-[2px] left-0 md:-left-[33px] print:hidden has-[>svg]:px-2"
            onClick={() => addRowToGroup(groupIndex)}
          >
            <Plus />
          </Button>
        )}
        <input
          type="text"
          value={row.date}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'date', e.target.value)
          }
          className={cn(
            'w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase',
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <input
          type="text"
          value={row.day}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'day', e.target.value)
          }
          className={cn(
            'w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase',
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <input
          type="text"
          value={row.sched}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'sched', e.target.value)
          }
          className={cn(
            'w-full h-full border-none outline-none bg-transparent text-xs uppercase',
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <input
          type="text"
          value={row.timeIn}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'timeIn', e.target.value)
          }
          className={cn(
            'w-full h-full border-none outline-none bg-transparent text-xs uppercase',
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <input
          type="text"
          value={row.timeOut}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'timeOut', e.target.value)
          }
          className={cn(
            'w-full h-full border-none outline-none bg-transparent text-xs uppercase',
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <AutoFitInput
          type="text"
          value={row.destination}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'destination', e.target.value)
          }
          className={cn(
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="border border-black p-1 print:py-0">
        <AutoFitInput
          type="text"
          value={row.remarks}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, 'remarks', e.target.value)
          }
          className={cn(
            isEditable ? 'cursor-text' : 'cursor-default text-center',
          )}
          readOnly={!isEditable}
        />
      </TableCell>
      <TableCell className="relative border border-black p-1 print:py-0">
        {signature.success && signature.data && isRowNotEmpty && (
          <Image
            src={signature.data}
            alt="Engineer Signature"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            width={100}
            height={100}
          />
        )}
      </TableCell>
    </TableRow>
  );
}
