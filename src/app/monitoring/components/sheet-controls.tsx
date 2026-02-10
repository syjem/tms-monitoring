'use client';

import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import SignatureMenu from '@/components/custom/signature-menu';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { OperationResult } from '@/utils/with-error-handler';
import { useQuery } from '@tanstack/react-query';
import { Loader, Printer, Save, Signature, SquarePen } from 'lucide-react';
import { useState } from 'react';

type ButtonActionsProps = {
  isSaving: boolean;
  isEditable: boolean;
  saveSheet: () => void;
  enableEditing: () => void;
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
};

export function SheetControls({
  isSaving,
  isEditable,
  saveSheet,
  enableEditing,
  signature,
}: ButtonActionsProps) {
  const [openSignatureDialog, setSignatureDialogState] = useState(false);
  const { data, refetch, isFetching } = useQuery({
    queryFn: () => getEngineerSignature(),
    queryKey: ['engineer-signature-at-sheet-controls'],
    refetchOnWindowFocus: false,
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed right-4 top-4 md:top-auto md:bottom-4 z-99 print:hidden">
      {isEditable ? (
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <SignatureMenu
              isFetching={isFetching}
              data={data}
              open={openSignatureDialog}
              refetch={refetch}
              onOpenChange={setSignatureDialogState}
            >
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  disabled={isSaving}
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600"
                >
                  <Signature className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
            </SignatureMenu>

            <TooltipContent side="left" sideOffset={4}>
              {signature.success && signature.data
                ? 'Edit Signature'
                : 'Set Signature'}
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                disabled={isSaving}
                onClick={saveSheet}
                className="cursor-pointer"
              >
                {isSaving ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              Save
            </TooltipContent>
          </Tooltip>
        </div>
      ) : (
        <div className="flex flex-col space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={handlePrint}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600"
              >
                <Printer className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4} className="print:hidden">
              Print
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={enableEditing}
                className="cursor-pointer"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4} className="print:hidden">
              Edit
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
