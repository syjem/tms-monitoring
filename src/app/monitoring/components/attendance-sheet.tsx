'use client';

import { updateWorkLog } from '@/app/actions/logs/update-work-log';
import { ROWS_PER_PAGE } from '@/app/monitoring/_constants';
import {
  cloneAttendanceData,
  countRows,
  countTrailingEmptySingleGroups,
  createEmptyGroup,
  createEmptyRow,
  padToFullPages,
} from '@/app/monitoring/_utils';
import AddPage from '@/app/monitoring/components/add-page';
import { AttendanceSheetHeader } from '@/app/monitoring/components/attendance-sheet-header';
import AttendanceSheetTable from '@/app/monitoring/components/attendance-sheet-table';
import { SheetControls } from '@/app/monitoring/components/sheet-controls';
import { Signatories } from '@/app/monitoring/components/signatories';
import { SignatoriesPreview } from '@/app/monitoring/components/signatories-preview';
import { cn } from '@/lib/utils';
import type { AttendanceData, AttendancePageRow, AttendanceRow } from '@/types';
import { OperationResult } from '@/utils/with-error-handler';
import { Edit } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  const [activePage, setActivePage] = useState(0);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (workLog.id && workLog.logs && workLog.logs.length > 0) {
      return padToFullPages(workLog.logs);
    }

    return Array.from({ length: ROWS_PER_PAGE }, () => createEmptyGroup());
  });

  const totalRows = useMemo(() => countRows(attendanceData), [attendanceData]);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE)),
    [totalRows],
  );

  const pagedRows = useMemo(() => {
    const pages: AttendancePageRow[][] = Array.from(
      { length: pageCount },
      () => [],
    );

    let rowCounter = 0;

    attendanceData.forEach((group, groupIndex) => {
      group.forEach((row, rowIndex) => {
        const pageIndex = Math.floor(rowCounter / ROWS_PER_PAGE);
        pages[pageIndex].push({
          groupIndex,
          rowIndex,
          row,
        });
        rowCounter++;
      });
    });

    return pages;
  }, [attendanceData, pageCount]);

  useEffect(() => {
    setActivePage((prev) => Math.min(prev, pageCount - 1));
  }, [pageCount]);

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

  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      if (!isEditable) return;

      const isModifierPressed = event.ctrlKey || event.metaKey;
      if (!isModifierPressed) return;

      const key = event.key.toLowerCase();

      if (key === 'p') {
        event.preventDefault();
        toast.warning('Printing is disabled while on edit mode.');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [isEditable]);

  const enableEditing = () => {
    setIsEditable(true);
    toast.warning('Edit mode enabled', {
      icon: <Edit className="h-4 w-4" />,
    });
  };

  const addRowToGroup = (groupIndex: number) => {
    if (!isEditable) return;

    const prevData = structuredClone(attendanceData);
    const prevPage = activePage;
    let createdNewPage = false;

    setAttendanceData((prev) => {
      const nextData = cloneAttendanceData(prev);
      const hasTrailingEmptyGroups = countTrailingEmptySingleGroups(prev) > 0;

      if (!hasTrailingEmptyGroups) {
        createdNewPage = true;
        nextData.push(
          ...Array.from({ length: ROWS_PER_PAGE }, () => createEmptyGroup()),
        );
      }

      nextData[groupIndex] = [...nextData[groupIndex], createEmptyRow()];

      nextData.pop();

      return nextData;
    });

    if (createdNewPage) {
      setActivePage(pageCount);
    }

    toast.success('Added a new row.', {
      action: {
        label: 'Undo',
        onClick: () => {
          setAttendanceData(prevData);
          setActivePage(prevPage);
          toast.warning('Row removed');
        },
      },
    });
  };

  const addPage = () => {
    if (!isEditable) return;

    const prevData = structuredClone(attendanceData);
    const prevPage = activePage;

    setAttendanceData((prev) => [
      ...prev,
      ...Array.from({ length: ROWS_PER_PAGE }, () => createEmptyGroup()),
    ]);

    setActivePage(pageCount);
    toast.success('Added a new page.', {
      action: {
        label: 'Undo',
        onClick: () => {
          setAttendanceData(prevData);
          setActivePage(prevPage);
          toast.warning('Page removed');
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-white px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AddPage
        activePage={activePage}
        pageCount={pageCount}
        setActivePage={setActivePage}
        addPage={addPage}
        isEditable={isEditable}
      />

      <SheetControls
        isSaving={isSaving}
        isEditable={isEditable}
        saveSheet={saveSheet}
        enableEditing={enableEditing}
        signature={signature}
      />

      <div className="mx-auto max-w-4xl space-y-8 print:max-w-[700px] print:space-y-0">
        {pagedRows.map((rows, pageIndex) => (
          <section
            key={`sheet-page-${pageIndex + 1}`}
            className={cn(
              'attendance-sheet-page',
              pageIndex === activePage ? 'block' : 'hidden',
              'print:block',
            )}
          >
            <AttendanceSheetHeader />

            <AttendanceSheetTable
              rows={rows}
              hoveredGroup={hoveredGroup}
              isEditable={isEditable && activePage === pageIndex}
              setHoveredGroup={setHoveredGroup}
              updateCell={updateCell}
              addRowToGroup={addRowToGroup}
              signature={signature}
            />

            {/* Keep only one interactive Signatories instance mounted at a time. */}
            {pageIndex === activePage ? (
              <Signatories
                isEditable={isEditable}
                signature={signature}
                signatories={signatories}
              />
            ) : (
              <SignatoriesPreview
                signature={signature}
                signatories={signatories}
              />
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
