'use client';

import SignatureMenu from '@/components/customs/signature-menu';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useSetSignature, useSignature } from '@/contexts/signature';
import { PenLine, Plus, Signature } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function SignaturePanel() {
  const [open, setOpen] = useState(false);

  const signature = useSignature();
  const setSignature = useSetSignature();

  const signatureImage =
    signature?.success && typeof signature.data === 'string'
      ? signature.data
      : null;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Signature className="size-4 text-primary" />
            <CardTitle className="doc-subtitle">Signature</CardTitle>
          </div>
          <CardDescription className="doc-caption">
            {signatureImage ? 'Update' : 'Add'} the signature used in your
            monitoring sheets and signatory blocks.
          </CardDescription>
        </div>
        <CardAction className="w-full sm:w-auto">
          <SignatureMenu
            open={open}
            onOpenChange={setOpen}
            data={signature}
            onSavedSignature={(signatureData) =>
              setSignature({ success: true, data: signatureData })
            }
          >
            <Button variant="outline" className="w-full">
              {signatureImage ? <PenLine /> : <Plus />}
              {signatureImage ? 'Edit Signature' : 'Add Signature'}
            </Button>
          </SignatureMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        {signatureImage ? (
          <div className="relative h-55 rounded-lg border bg-muted">
            <Image
              src={signatureImage}
              alt="Saved signature"
              fill
              className="object-contain p-4"
            />
          </div>
        ) : (
          <div className="doc-body flex min-h-45 items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-center text-sm">
            No signature saved yet. Add one so it can be reused in future
            monitorings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
