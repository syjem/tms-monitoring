import { setEngineerSignature } from '@/app/actions/profiles/set-signature';
import SignaturePad from '@/components/signature-pad';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useElementSize } from '@/hooks/use-element-size';

import useScreenSize from '@/hooks/use-screen-size';
import { OperationResult } from '@/utils/with-error-handler';
import { DialogProps } from '@radix-ui/react-dialog';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type EngineerResult =
  | OperationResult<string | null | undefined, Record<string, unknown>>
  | undefined;

type SignatureMenuProps = DialogProps & {
  isFetching: boolean;
  data: EngineerResult;
  refetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<QueryObserverResult<EngineerResult, Error>>;
};

function SignatureMenu({
  children,
  open,
  data,
  isFetching,
  refetch,
  ...rest
}: SignatureMenuProps) {
  const router = useRouter();
  const [edit, setEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { ref, width, padding } = useElementSize<HTMLDivElement>();
  const { width: windowWidth } = useScreenSize();

  // Reset edit state on close modal
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setEdit(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleSaveSignature = useCallback(
    async (signatureData: string) => {
      try {
        // enable loader
        setSubmitting(true);

        return toast.promise(() => setEngineerSignature(signatureData), {
          loading: 'Saving signature...',
          success: (data) => {
            if (!data.success) throw new Error(data.error.message);

            refetch(); // fetch data from the database
            router.refresh(); // refresh the page to reflect changes
            setEdit(false); // reset edit mode
            setSubmitting(false); // reset loader

            return 'Signature saved successfully!';
          },
          error: (e) => {
            setSubmitting(false);
            return (
              e?.message ||
              'Something went wrong while tyring to save signature!'
            );
          },
        });
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e?.message || 'Something went wrong!');
        }
        setSubmitting(false); // reset state
      }
    },
    [refetch, router],
  );

  const onEditClick = useCallback(() => {
    setEdit((prev) => !prev);
  }, []);

  const isInMobile = windowWidth <= 540;
  const shouldShowCanvas = edit || !data?.success || !data.data;

  const widthForMobile = useMemo(() => {
    return width - (padding.right + padding.left);
  }, [width, padding]);

  const Comp = isInMobile ? Sheet : Dialog;
  const CompTrigger = isInMobile ? SheetTrigger : DialogTrigger;
  const CompContent = isInMobile ? SheetContent : DialogContent;
  const CompHeader = isInMobile ? SheetHeader : DialogHeader;
  const CompTitle = isInMobile ? SheetTitle : DialogTitle;
  const CompDescription = isInMobile ? SheetDescription : DialogDescription;

  return (
    <Comp open={open} {...rest}>
      <form>
        <CompTrigger asChild>{children}</CompTrigger>
        <CompContent className="max-w-full md:max-w-fit" side="bottom">
          <CompHeader>
            <CompTitle>My Signature</CompTitle>
            <CompDescription>
              {isFetching
                ? 'Loading signature details...'
                : data?.success && data?.data
                  ? 'Manage your signature!'
                  : 'Create your signature here!'}
            </CompDescription>
          </CompHeader>
          <div className="p-4 pt-0 md:p-0 w-full" ref={ref}>
            {isFetching ? (
              <div className="flex flex-col items-end">
                <Skeleton className="w-full md:w-[500px] h-[300px]" />
                <Skeleton className="w-[100px] h-9 mt-4" />
              </div>
            ) : (
              <Fragment>
                {shouldShowCanvas ? (
                  <SignaturePad
                    width={isInMobile ? widthForMobile : 500}
                    height={300}
                    onSaveSignature={handleSaveSignature}
                    strokeWidth={3}
                    isSavingSignature={submitting}
                    onCancel={() => setEdit(false)}
                    showCancelAction={edit}
                    strokeColor="#000000"
                  />
                ) : (
                  <div className="flex flex-col items-end">
                    <div className="h-[300px] w-full md:w-[500px] bg-muted rounded-md relative">
                      <Image src={data.data as string} alt="signature" fill />
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={onEditClick}
                    >
                      <Pencil /> Edit Signature
                    </Button>
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </CompContent>
      </form>
    </Comp>
  );
}

export default SignatureMenu;
