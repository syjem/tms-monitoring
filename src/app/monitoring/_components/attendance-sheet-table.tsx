import { CustomTableHead } from '@/app/monitoring/_components/table-head';
import { CustomTableRow } from '@/app/monitoring/_components/table-row';
import { Table, TableBody } from '@/components/ui/table';
import type { AttendancePageRow, AttendanceRow } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';
import { SetStateAction } from 'react';

type AttendanceSheetTableProps = {
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

function AttendanceSheetTable({
  rows,
  hoveredGroup,
  isEditable,
  setHoveredGroup,
  updateCell,
  addRowToGroup,
}: AttendanceSheetTableProps) {
  return (
    <Table className="text-xs mb-4">
      <CustomTableHead />
      <TableBody>
        {rows.map(({ groupIndex, row, rowIndex }) => {
          const isHighlighted = hoveredGroup === groupIndex;
          const isFirstRowInGroup = rowIndex === 0;
          const isRowNotEmpty = !isRowEmpty(row);

          return (
            <CustomTableRow
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

export default AttendanceSheetTable;
