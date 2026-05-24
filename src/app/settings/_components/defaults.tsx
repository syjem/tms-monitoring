'use client';

import { setDefaults } from '@/actions/profiles/set-defaults';
import { DefaultsDialog } from '@/app/settings/_components/defaults-dialog';
import { Button } from '@/components/ui/button';
import type { AttendanceDefaults } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { Layers2, PenLine } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type DefaultsPanelProps = {
  defaults: AttendanceDefaults;
};

export function DefaultsPanel({
  defaults: initialDefaults,
}: DefaultsPanelProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaults, setDefaultsState] = useState(initialDefaults);

  const handleSubmit = async (values: AttendanceDefaults) => {
    setIsSubmitting(true);
    const previousDefaults = defaults;

    try {
      await setDefaults(values);
      setDefaultsState(values);

      await queryClient.invalidateQueries({
        queryKey: ['defaults'],
      });
      toast.success('Attendance defaults saved.');
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save attendance defaults',
      );
      setDefaultsState(previousDefaults);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm">
      <DefaultsDialog
        key={`${defaults.destination}-${defaults.remarks}`}
        open={open}
        setOpen={setOpen}
        defaults={defaults}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers2 className="size-4 text-primary" />
            <p className="doc-subtitle text-sm">Defaults</p>
          </div>
          <p className="doc-caption">
            Change your destination and remarks&apos; defaults.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(true)}
          disabled={isSubmitting}
        >
          <PenLine />
          Edit Defaults
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="doc-caption font-medium uppercase">
            Destination
          </p>
          <p className="doc-subtitle mt-1 text-sm">
            {defaults.destination}
          </p>
        </div>

        <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
          <p className="doc-caption font-medium uppercase">
            Remarks
          </p>
          <p className="doc-subtitle mt-1 text-sm">
            {defaults.remarks}
          </p>
        </div>
      </div>
    </section>
  );
}
