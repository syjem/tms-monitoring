'use client';

import { setAttendanceDefaults } from '@/app/actions/profiles/set-attendance-defaults';
import { AttendanceDefaultsDialog } from '@/components/attendance-defaults-dialog';
import { Button } from '@/components/ui/button';
import { useAttendanceDefaults } from '@/hooks/use-attendance-defaults';
import type { AttendanceDefaults } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { Layers2, Loader, PenLine } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AttendanceDefaultsPanel() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { attendanceDefaults, isLoading, isFetching } = useAttendanceDefaults();

  const handleSubmit = async (values: AttendanceDefaults) => {
    setIsSubmitting(true);

    try {
      const result = await setAttendanceDefaults(values);

      if (!result.success) {
        toast.error(
          result.error.message || 'Failed to save attendance defaults',
        );
        return false;
      }

      await queryClient.invalidateQueries({
        queryKey: ['attendance-defaults'],
      });
      toast.success('Attendance defaults saved.');
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save attendance defaults',
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm">
      <AttendanceDefaultsDialog
        open={open}
        setOpen={setOpen}
        defaults={attendanceDefaults}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers2 className="size-4 text-blue-600" />
            <p className="font-semibold text-gray-900">Defaults</p>
          </div>
          <p className="text-xs text-gray-600">
            Change your destination and remarks&apos; defaults.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={isLoading || isFetching || isSubmitting}
        >
          {isFetching && !isLoading ? (
            <>
              <Loader className="size-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <PenLine />
              Edit Defaults
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Destination
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {attendanceDefaults.destination}
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Remarks
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {attendanceDefaults.remarks}
          </p>
        </div>
      </div>
    </section>
  );
}
