'use client';

import { updateWorkLog } from '@/app/actions/logs/update-work-log';
import { AttendanceSheetHeader } from '@/app/monitoring/components/attendance-sheet-header';
import AttendanceSheetTable from '@/app/monitoring/components/attendance-sheet-table';
import { SheetControls } from '@/app/monitoring/components/sheet-controls';
import { Signatories } from '@/app/monitoring/components/signatories';
import type { AttendanceData, AttendanceRow } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';
import { OperationResult } from '@/utils/with-error-handler';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type AttendanceSheetProps = {
  workLog: { id: string; logs: AttendanceData };
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
  signatories: OperationResult<
    {
      id: number;
      name: string;
      title: string;
      includeSignature: boolean;
    }[],
    Record<string, unknown>
  >;
};

export default function AttendanceSheet({
  workLog,
  signature,
  signatories,
}: AttendanceSheetProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (workLog.id && workLog.logs && workLog.logs.length > 0) {
      return workLog.logs;
    }
    // Default empty groups if no initial data - 40 single-row
    return Array.from({ length: 40 }, () => [
      {
        date: '',
        day: '',
        sched: '',
        timeIn: '',
        timeOut: '',
        destination: '',
        remarks: '',
        signature: '',
      },
    ]);
  });

  const updateCell = (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string,
  ) => {
    if (!isEditable) return;

    setAttendanceData((prev) =>
      prev.map((group, gIndex) =>
        gIndex === groupIndex
          ? group.map((row, rIndex) =>
              rIndex === rowIndex ? { ...row, [field]: value } : row,
            )
          : group,
      ),
    );
  };

  const saveSheet = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving attendance sheet...');

    try {
      const { success } = await updateWorkLog(workLog.id, attendanceData);

      if (!success) {
        toast.error('Failed to save attendance sheet.');
        return;
      }

      toast.success('Attendance sheet saved!', {
        id: toastId,
      });
      setIsEditable(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to save attendance sheet.';
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
    toast.warning('Edit mode enabled', {
      icon: <Edit className="h-4 w-4" />,
    });
  };

  const addRowToGroup = (groupIndex: number) => {
    if (!isEditable) return;

    // Count non-empty rows across all groups
    const nonEmptyRowsCount = attendanceData.reduce((total, group) => {
      return total + group.filter((row) => !isRowEmpty(row)).length;
    }, 0);

    // Check if we're at capacity (all 40 rows filled with data)
    if (nonEmptyRowsCount >= 40) {
      toast.error('Cannot add row - all 40 rows are filled with data');
      return;
    }

    // Find empty groups at the end to remove
    let emptyGroupsFromEnd = 0;
    for (let i = attendanceData.length - 1; i >= 0; i--) {
      const group = attendanceData[i];
      if (group.length === 1 && isRowEmpty(group[0])) {
        emptyGroupsFromEnd++;
      } else {
        break;
      }
    }

    if (emptyGroupsFromEnd === 0) {
      toast.error('Cannot add row - no empty rows available to remove');
      return;
    }

    // copy of previous data for undo
    const prevData = structuredClone(attendanceData);

    // update the state
    setAttendanceData((prev) => {
      const newData = [...prev];

      // Add completely empty row to the specified group
      newData[groupIndex] = [
        ...newData[groupIndex],
        {
          date: '',
          day: '',
          sched: '',
          timeIn: '',
          timeOut: '',
          destination: '',
          remarks: '',
        },
      ];

      // Remove one empty group from the end to maintain 40 total rows
      newData.pop();

      return newData;
    });
    toast.info('You added a row..', {
      action: {
        label: 'Undo',
        onClick: () => {
          setAttendanceData(prevData);
          toast.info('Row removed');
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-white px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AttendanceSheetHeader />

      <SheetControls
        isSaving={isSaving}
        isEditable={isEditable}
        saveSheet={saveSheet}
        enableEditing={enableEditing}
        signature={signature}
      />

      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <AttendanceSheetTable
          attendanceData={attendanceData}
          hoveredGroup={hoveredGroup}
          isEditable={isEditable}
          setHoveredGroup={setHoveredGroup}
          updateCell={updateCell}
          addRowToGroup={addRowToGroup}
          signature={signature}
        />
      </div>

      <Signatories
        isEditable={isEditable}
        signature={signature}
        signatories={signatories}
      />
    </main>
  );
}
