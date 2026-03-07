import { CustomTableHead } from '@/app/monitoring/components/table-head';
import { CustomTableRow } from '@/app/monitoring/components/table-row';
import { Table, TableBody } from '@/components/ui/table';
import type { AttendancePageRow, AttendanceRow } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';
import { OperationResult } from '@/utils/with-error-handler';
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
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
};

function AttendanceSheetTable({
  rows,
  hoveredGroup,
  isEditable,
  setHoveredGroup,
  updateCell,
  addRowToGroup,
  signature,
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
              signature={signature}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}

export default AttendanceSheetTable;
