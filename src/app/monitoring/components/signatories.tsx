'use client';

import { setSignatories } from '@/app/actions/profiles/set-signatories';
import { FirstSignatoryDialog } from '@/app/monitoring/components/first-dialog';
import { SecondSignatoryDialog } from '@/app/monitoring/components/second-dialog';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { OperationResult } from '@/utils/with-error-handler';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

type SignatoriesProps = {
  isEditable: boolean;
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

type Signatory = {
  id: number;
  name: string;
  title: string;
  includeSignature: boolean;
};

export const Signatories = ({
  isEditable,
  signature,
  signatories,
}: SignatoriesProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);

  const [optimisticData, setOptimisticData] = useState<Signatory[] | null>(
    null,
  );

  const serverData = signatories.success ? signatories.data : [];
  const data = optimisticData ?? serverData;

  const firstSignatory = data.find((s) => s.id === 1) || {
    name: '',
    title: '',
    includeSignature: false,
  };

  const secondSignatory = data.find((s) => s.id === 2) || {
    name: '',
    title: '',
    includeSignature: false,
  };

  const handleAddFirstSignatory = () => {
    if (!isEditable) return;
    setIsFirstDialogOpen(true);
  };

  const handleAddSecondSignatory = () => {
    if (!isEditable) return;
    setIsSecondDialogOpen(true);
  };

  const handleDialogSubmit = async (formData: {
    id: number;
    name: string;
    title: string;
    includeSignature: boolean;
  }) => {
    setIsSubmitting(true);

    const { id, name, title, includeSignature } = formData;

    if (!id || !name || !title) {
      setIsSubmitting(false);
      return;
    }

    const newSignatory = { id, name, title, includeSignature };

    const updatedSignatories = [
      ...data.filter((s) => s.id !== id),
      newSignatory,
    ].sort((a, b) => a.id - b.id);

    // previous state for rollback in case of error
    const previousData = data;

    const action = data.some((s) => s.id === id) ? 'updated' : 'added';
    const successMessageByID =
      id === 1
        ? `First signatory ${action} successfully`
        : `Second signatory ${action} successfully`;

    try {
      setOptimisticData(updatedSignatories);
      if (id === 1) setIsFirstDialogOpen(false);
      if (id === 2) setIsSecondDialogOpen(false);

      toast.success(successMessageByID);

      const result = await setSignatories(updatedSignatories);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      router.refresh();
    } catch (error) {
      setOptimisticData(previousData); // Rollback on error
      toast.error(
        error instanceof Error ? error.message : 'Failed to update signatories',
      );

      // Reopen the dialog on error so user can retry
      if (id === 1) setIsFirstDialogOpen(true);
      if (id === 2) setIsSecondDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFirstSignatory = async () => {
    if (!isEditable) return;
    setIsSubmitting(true);

    const updatedSignatories = data.filter((s) => s.id !== 1);
    const previousData = data;

    try {
      setOptimisticData(updatedSignatories);
      toast.success('Signatory removed successfully');
      const result = await setSignatories(updatedSignatories);
      if (!result.success) throw new Error(result.error.message);
      router.refresh();
    } catch (error) {
      setOptimisticData(previousData);
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove signatory',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSecondSignatory = async () => {
    if (!isEditable) return;
    setIsSubmitting(true);

    const updatedSignatories = data.filter((s) => s.id !== 2);
    const previousData = data;

    try {
      setOptimisticData(updatedSignatories);
      toast.success('Signatory removed successfully');
      const result = await setSignatories(updatedSignatories);
      if (!result.success) throw new Error(result.error.message);
      router.refresh();
    } catch (error) {
      setOptimisticData(previousData);
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove signatory',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <FirstSignatoryDialog
        open={isFirstDialogOpen}
        setOpen={setIsFirstDialogOpen}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        firstSignatory={firstSignatory}
      />

      <SecondSignatoryDialog
        open={isSecondDialogOpen}
        setOpen={setIsSecondDialogOpen}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
        secondSignatory={secondSignatory}
      />

      <footer className="flex gap-4 justify-between mx-auto max-w-4xl print:max-w-[700px]">
        {firstSignatory.name ? (
          <div
            onClick={handleAddFirstSignatory}
            className={cn(
              'relative flex flex-col items-stretch max-w-1/2 px-2 md:px-8 print:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 absolute -top-2 -right-2 bg-gray-50 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFirstSignatory();
                }}
              >
                <X className="text-red-500" />
              </Button>
            )}

            {signature.success &&
              signature.data &&
              firstSignatory.includeSignature && (
                <Image
                  src={signature.data}
                  alt="Engineer Signature"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  width={180}
                  height={108}
                />
              )}
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {firstSignatory.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {firstSignatory.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddFirstSignatory}
            className={cn(
              'max-w-1/3 transition-all rounded-sm gap-0 py-2 border-2 border-dashed active:scale-95',
              isEditable
                ? 'border-slate-700  active:border-primary'
                : 'border-transparent active:border-transparent',
            )}
          >
            {isEditable ? (
              <EmptyHeader className="gap-0">
                <EmptyMedia variant="icon" className="bg-gray-200">
                  <Plus className="size-4" />
                </EmptyMedia>
                <EmptyDescription>Add a signatory</EmptyDescription>
              </EmptyHeader>
            ) : null}
          </Empty>
        )}

        {secondSignatory.name ? (
          <div
            onClick={handleAddSecondSignatory}
            className={cn(
              'relative flex flex-col items-stretch max-w-1/2 px-2 md:px-8 print:px-8 py-4 transition-all rounded-sm',
              isEditable &&
                'border-2 border-dashed border-gray-400 active:border-primary active:scale-95',
            )}
          >
            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8 absolute -top-2 -right-2 bg-gray-50 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveSecondSignatory();
                }}
              >
                <X className="text-red-500" />
              </Button>
            )}

            {signature.success &&
              signature.data &&
              secondSignatory.includeSignature && (
                <Image
                  src={signature.data}
                  alt="Engineer Signature"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  width={180}
                  height={108}
                />
              )}
            <h5 className="text-center text-base md:text-2xl font-semibold print:text-xl">
              {secondSignatory.name}
            </h5>
            <p className="text-center text-xs md:text-sm text-gray-700">
              {secondSignatory.title}
            </p>
          </div>
        ) : (
          <Empty
            onClick={handleAddSecondSignatory}
            className={cn(
              'max-w-1/3 transition-all rounded-sm gap-0 py-2 border-2 border-dashed active:scale-95',
              isEditable
                ? 'border-slate-700  active:border-primary'
                : 'border-transparent active:border-transparent',
            )}
          >
            {isEditable ? (
              <EmptyHeader className="gap-0">
                <EmptyMedia variant="icon" className="bg-gray-200">
                  <Plus className="size-4" />
                </EmptyMedia>
                <EmptyDescription>Add a signatory</EmptyDescription>
              </EmptyHeader>
            ) : null}
          </Empty>
        )}
      </footer>
    </React.Fragment>
  );
};
