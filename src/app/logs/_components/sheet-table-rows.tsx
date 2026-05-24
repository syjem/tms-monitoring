'use client';

import { AutoFitInput } from '@/app/logs/_components/auto-fit-input';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useSignature } from '@/contexts/signature';
import { cn } from '@/lib/utils';
import type { AttendanceRow } from '@/types';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { SetStateAction } from 'react';

type SheetTableRowProps = {
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
};

export function SheetTableRow({
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
}: SheetTableRowProps) {
  const signature = useSignature();

  return (
    <TableRow
      className={cn(
        'motion-safe:transition-colors motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-blue-100',
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
            variant="default"
            className="absolute -top-0.5 left-0 h-full rounded-sm md:-left-8.25 print:hidden has-[>svg]:px-2 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
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
            isEditable ? 'cursor-text' : 'cursor-default text-center ',
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
