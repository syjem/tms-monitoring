import { SheetTableHead } from '@/app/logs/_components/sheet-table-head';
import { SheetTableRow } from '@/app/logs/_components/sheet-table-rows';
import { Table, TableBody } from '@/components/ui/table';
import type { AttendancePageRow, AttendanceRow } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';
import { SetStateAction } from 'react';

type SheetTableProps = {
  rows: AttendancePageRow[];
  hoveredGroup: number | null;
  isEditable: boolean;
  updateCell: (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string,
  ) => void;
  setHoveredGroup: (value: SetStateAction<number | null>) => void;
  addRowToGroup: (groupIndex: number) => void;
};

function SheetTable({
  rows,
  hoveredGroup,
  isEditable,
  setHoveredGroup,
  updateCell,
  addRowToGroup,
}: SheetTableProps) {
  return (
    <Table className="text-xs mb-4">
      <SheetTableHead />
      <TableBody>
        {rows.map(({ groupIndex, row, rowIndex }) => {
          const isHighlighted = hoveredGroup === groupIndex;
          const isFirstRowInGroup = rowIndex === 0;
          const isRowNotEmpty = !isRowEmpty(row);

          return (
            <SheetTableRow
              key={`${groupIndex}-${rowIndex}`}
              groupIndex={groupIndex}
              row={row}
              rowIndex={rowIndex}
              isEditable={isEditable}
              isHighlighted={isHighlighted}
              isFirstRowInGroup={isFirstRowInGroup}
              isRowNotEmpty={isRowNotEmpty}
              setHoveredGroup={setHoveredGroup}
              addRowToGroup={addRowToGroup}
              updateCell={updateCell}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

export default SheetTable;
