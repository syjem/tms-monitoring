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
import { useState } from 'react';

type ReplaceDefaultValuesDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onApply: (values: { destination: string; remarks: string }) => void;
};

export function ReplaceDefaultValuesDialog({
  open,
  setOpen,
  onApply,
}: ReplaceDefaultValuesDialogProps) {
  const [destination, setDestination] = useState('');
  const [remarks, setRemarks] = useState('');

  const { width } = useScreenSize();
  const isInMobile = width <= 540;

  const Custom = isInMobile ? Sheet : Dialog;
  const CustomContent = isInMobile ? SheetContent : DialogContent;
  const CustomHeader = isInMobile ? SheetHeader : DialogHeader;
  const CustomTitle = isInMobile ? SheetTitle : DialogTitle;
  const CustomDescription = isInMobile ? SheetDescription : DialogDescription;
  const CustomFooter = isInMobile ? SheetFooter : DialogFooter;
  const CustomClose = isInMobile ? SheetClose : DialogClose;

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onApply({
      destination: destination.trim(),
      remarks: remarks.trim(),
    });
    setOpen(false);
  };

  const isApplyDisabled =
    destination.trim().length === 0 && remarks.trim().length === 0;

  return (
    <Custom open={open} onOpenChange={setOpen}>
      <CustomContent
        className="max-w-full md:max-w-[425px] p-4 md:p-6"
        side="bottom"
      >
        <CustomHeader className="px-0">
          <CustomTitle>Replace Default Values</CustomTitle>
          <CustomDescription>
            Replace app level default values with your custom values. Leave a
            field empty to keep
          </CustomDescription>
        </CustomHeader>

        <form onSubmit={handleApply}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="destination-default">Replace `OFFICE` with</Label>
              <Input
                id="destination-default"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Enter a new destination"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="remarks-default">
                Replace `DUTY ON CALL` with
              </Label>
              <Input
                id="remarks-default"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter new remarks"
              />
            </div>
          </div>

          <CustomFooter className="mt-4 flex-col-reverse px-0">
            <CustomClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </CustomClose>
            <Button type="submit" disabled={isApplyDisabled}>
              Apply
            </Button>
          </CustomFooter>
        </form>
      </CustomContent>
    </Custom>
  );
}
