'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import useScreenSize from '@/hooks/use-screen-size';
import type { AttendanceDefaults } from '@/types';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';

type DefaultsDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaults: AttendanceDefaults;
  isSubmitting: boolean;
  onSubmit: (values: AttendanceDefaults) => Promise<boolean>;
};

export function DefaultsDialog({
  open,
  setOpen,
  defaults,
  isSubmitting,
  onSubmit,
}: DefaultsDialogProps) {
  const [destination, setDestination] = useState(defaults.destination);
  const [remarks, setRemarks] = useState(defaults.remarks);

  const { width } = useScreenSize();
  const isInMobile = width <= 540;

  const Custom = isInMobile ? Sheet : Dialog;
  const CustomContent = isInMobile ? SheetContent : DialogContent;
  const CustomHeader = isInMobile ? SheetHeader : DialogHeader;
  const CustomTitle = isInMobile ? SheetTitle : DialogTitle;
  const CustomDescription = isInMobile ? SheetDescription : DialogDescription;
  const CustomFooter = isInMobile ? SheetFooter : DialogFooter;
  const CustomClose = isInMobile ? SheetClose : DialogClose;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = await onSubmit({
      destination: destination.trim(),
      remarks: remarks.trim(),
    });

    if (success) {
      setOpen(false);
    }
  };

  const isSubmitDisabled =
    isSubmitting ||
    destination.trim().length === 0 ||
    remarks.trim().length === 0;

  return (
    <Custom open={open} onOpenChange={setOpen}>
      <CustomContent
        className="max-w-full p-4 md:max-w-106.25 md:p-6"
        side="bottom"
      >
        <CustomHeader className="px-0">
          <CustomTitle>Attendance Defaults</CustomTitle>
          <CustomDescription>
            These values will be used when creating new monitorings if the
            extracted row has no destination or remarks value.
          </CustomDescription>
        </CustomHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="default-destination">Default Destination</Label>
              <Input
                id="default-destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter default destination"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="default-remarks">Default Remarks</Label>
              <Input
                id="default-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter default remarks"
              />
            </div>
          </div>

          <CustomFooter className="mt-4 flex-col-reverse px-0">
            <CustomClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </CustomClose>
            <Button type="submit" disabled={isSubmitDisabled}>
              {isSubmitting ? (
                <React.Fragment>
                  <Loader className="size-4 animate-spin" />
                  Saving...
                </React.Fragment>
              ) : (
                'Save Defaults'
              )}
            </Button>
          </CustomFooter>
        </form>
      </CustomContent>
    </Custom>
  );
}
