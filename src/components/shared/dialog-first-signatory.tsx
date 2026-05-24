import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { signatorySchema } from '@/lib/zod/schema';
import { Loader } from 'lucide-react';
import React, { useState } from 'react';
import z from 'zod';

type FirstSignatoryDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (data: {
    id: number;
    name: string;
    title: string;
    includeSignature: boolean;
  }) => Promise<void>;
  isSubmitting: boolean;
  firstSignatory: { name: string; title: string; includeSignature: boolean };
};

export function FirstSignatoryDialog({
  open,
  setOpen,
  onSubmit,
  isSubmitting,
  firstSignatory,
}: FirstSignatoryDialogProps) {
  const [errors, setErrors] = useState<{
    name?: string;
    title?: string;
  }>({});

  const { width } = useScreenSize();
  const isInMobile = width <= 540;

  const Custom = isInMobile ? Sheet : Dialog;
  const CustomContent = isInMobile ? SheetContent : DialogContent;
  const CustomHeader = isInMobile ? SheetHeader : DialogHeader;
  const CustomTitle = isInMobile ? SheetTitle : DialogTitle;
  const CustomDescription = isInMobile ? SheetDescription : DialogDescription;
  const CustomFooter = isInMobile ? SheetFooter : DialogFooter;
  const CustomClose = isInMobile ? SheetClose : DialogClose;

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.currentTarget);
    const data = {
      id: Number(formData.get('id')),
      name: formData.get('name') as string,
      title: formData.get('title') as string,
      includeSignature: formData.get('includeSignature') === 'on',
    };

    // Validate with Zod
    const result = signatorySchema.safeParse(data);

    if (!result.success) {
      const tree = z.treeifyError(result.error);
      setErrors({
        name: tree.properties?.name?.errors[0],
        title: tree.properties?.title?.errors[0],
      });
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <Custom open={open} onOpenChange={setOpen}>
      <CustomContent
        className="max-w-full md:max-w-106.25 p-4 md:p-6"
        side="bottom"
        aria-describedby="first-signatory-dialog"
      >
        <CustomHeader className="px-0">
          <CustomTitle>
            {!firstSignatory.name ? 'Add' : 'Edit'} Signatory
          </CustomTitle>
          <CustomDescription>
            Fill in the details for the first signatory.
          </CustomDescription>
        </CustomHeader>
        <form onSubmit={handleSubmit}>
          <Input type="hidden" name="id" defaultValue={1} />
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={firstSignatory.name}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="title">Position</Label>
              <Input
                id="title"
                name="title"
                defaultValue={firstSignatory.title}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <Label
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary has-aria-checked:bg-green-50 
              cursor-pointer"
            >
              <Checkbox
                name="includeSignature"
                defaultChecked={firstSignatory.includeSignature}
                id="signatory-1"
                className="data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  Add Signature
                </p>
                <p className="text-muted-foreground text-sm">
                  Include your signature in this signatory.
                </p>
              </div>
            </Label>
          </div>
          <CustomFooter className="mt-4 flex-col-reverse px-0">
            <CustomClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </CustomClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <React.Fragment>
                  <Loader className="size-4 animate-spin" />
                  Saving...
                </React.Fragment>
              ) : (
                'Save'
              )}
            </Button>
          </CustomFooter>
        </form>
      </CustomContent>
    </Custom>
  );
}
