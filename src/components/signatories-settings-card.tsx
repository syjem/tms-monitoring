'use client';

import { setSignatories } from '@/app/actions/profiles/set-signatories';
import { FirstSignatoryDialog } from '@/app/monitoring/_components/first-dialog';
import { SecondSignatoryDialog } from '@/app/monitoring/_components/second-dialog';
import { useSignature } from '@/app/monitoring/_components/signature-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { OperationResult } from '@/utils/with-error-handler';
import { FilePenLine, PenLine, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

type Signatory = {
  id: number;
  name: string;
  title: string;
  includeSignature: boolean;
};

type SignatoriesSettingsCardProps = {
  signatories: OperationResult<Signatory[], Record<string, unknown>>;
};

export function SignatoriesSettingsCard({
  signatories,
}: SignatoriesSettingsCardProps) {
  const signature = useSignature();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [optimisticData, setOptimisticData] = useState<Signatory[] | null>(
    null,
  );

  const serverData = signatories.success ? signatories.data : [];
  const data = optimisticData ?? serverData;

  const firstSignatory = data.find((signatory) => signatory.id === 1) || {
    name: '',
    title: '',
    includeSignature: false,
  };

  const secondSignatory = data.find((signatory) => signatory.id === 2) || {
    name: '',
    title: '',
    includeSignature: false,
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
      ...data.filter((signatory) => signatory.id !== id),
      newSignatory,
    ].sort((a, b) => a.id - b.id);

    const previousData = data;
    const action = data.some((signatory) => signatory.id === id)
      ? 'updated'
      : 'added';

    try {
      setOptimisticData(updatedSignatories);
      if (id === 1) setIsFirstDialogOpen(false);
      if (id === 2) setIsSecondDialogOpen(false);

      toast.success(
        id === 1
          ? `First signatory ${action} successfully`
          : `Second signatory ${action} successfully`,
      );

      const result = await setSignatories(updatedSignatories);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      router.refresh();
    } catch (error) {
      setOptimisticData(previousData);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update signatories',
      );

      if (id === 1) setIsFirstDialogOpen(true);
      if (id === 2) setIsSecondDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSignatory = async (id: 1 | 2) => {
    setIsSubmitting(true);

    const updatedSignatories = data.filter((signatory) => signatory.id !== id);
    const previousData = data;

    try {
      setOptimisticData(updatedSignatories);
      toast.success('Signatory removed successfully');

      const result = await setSignatories(updatedSignatories);

      if (!result.success) {
        throw new Error(result.error.message);
      }

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
    <>
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

      <Card>
        <CardHeader>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FilePenLine className="size-4 text-blue-600" />
              <CardTitle className="text-sm font-semibold text-gray-900">
                Signatories
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-gray-600">
              Manage the two signatory slots that appear at the bottom of your
              monitoring sheets.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <SignatorySlot
              label="First Signatory"
              signatory={firstSignatory}
              signatureImage={signature.success ? signature.data : null}
              disabled={isSubmitting}
              onEdit={() => setIsFirstDialogOpen(true)}
              onRemove={() => handleRemoveSignatory(1)}
            />
            <SignatorySlot
              label="Second Signatory"
              signatory={secondSignatory}
              signatureImage={signature.success ? signature.data : null}
              disabled={isSubmitting}
              onEdit={() => setIsSecondDialogOpen(true)}
              onRemove={() => handleRemoveSignatory(2)}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function SignatorySlot({
  label,
  signatory,
  signatureImage,
  disabled,
  onEdit,
  onRemove,
}: {
  label: string;
  signatory: {
    name: string;
    title: string;
    includeSignature: boolean;
  };
  signatureImage: string | null | undefined;
  disabled: boolean;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const hasSignatory = Boolean(signatory.name);

  return (
    <div
      className={cn(
        'rounded-xl border bg-white p-4 shadow-sm transition-colors',
        hasSignatory ? 'border-gray-200' : 'border-dashed border-gray-300',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-xs text-gray-600">
            {hasSignatory
              ? 'Shown in generated monitoring sheets.'
              : 'No signatory assigned yet.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={onEdit}
          >
            {hasSignatory ? <PenLine /> : <Plus />}
            {hasSignatory ? 'Edit' : 'Add'}
          </Button>
          {hasSignatory ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={onRemove}
              className="text-muted-foreground"
            >
              <Trash2 />
            </Button>
          ) : null}
        </div>
      </div>

      {hasSignatory ? (
        <div className="relative mt-6 overflow-hidden rounded-lg border bg-muted/20 p-5">
          {signatureImage && signatory.includeSignature ? (
            <Image
              src={signatureImage}
              alt={`${label} signature preview`}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain p-4 opacity-80"
              fill
            />
          ) : null}
          <div className="relative min-h-[140px]">
            <div className="absolute inset-x-0 bottom-0 text-center">
              <p className="text-lg font-semibold text-gray-900">
                {signatory.name}
              </p>
              <p className="text-sm text-gray-700">{signatory.title}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center text-sm text-muted-foreground">
          Add a signatory to reserve this slot for future monitorings.
        </div>
      )}
    </div>
  );
}
