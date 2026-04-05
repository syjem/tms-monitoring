'use client';

import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import SignatureMenu from '@/components/custom/signature-menu';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { SignatureData } from '@/app/monitoring/_components/signature-context';
import { useQuery } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type SignatureSettingsCardProps = {
  initialSignature: SignatureData;
};

export function SignatureSettingsCard({
  initialSignature,
}: SignatureSettingsCardProps) {
  const [open, setOpen] = useState(false);

  const { data, refetch, isFetching } = useQuery({
    queryFn: () => getEngineerSignature(),
    queryKey: ['engineer-signature-settings'],
    refetchOnWindowFocus: false,
    initialData: initialSignature,
  });

  const signatureImage =
    data?.success && typeof data.data === 'string' ? data.data : null;

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Signature</CardTitle>
          <CardDescription>
            Update the signature used in your monitoring sheets and signatory
            blocks.
          </CardDescription>
        </div>
        <CardAction>
          <SignatureMenu
            open={open}
            onOpenChange={setOpen}
            data={data}
            isFetching={isFetching}
            refetch={refetch}
          >
            <Button variant="outline">
              <PenLine />
              {signatureImage ? 'Edit Signature' : 'Add Signature'}
            </Button>
          </SignatureMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isFetching && !data ? (
          <Skeleton className="h-[220px] w-full rounded-lg" />
        ) : signatureImage ? (
          <div className="relative h-[220px] rounded-lg border bg-muted">
            <Image
              src={signatureImage}
              alt="Saved signature"
              fill
              className="object-contain p-4"
            />
          </div>
        ) : (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-center text-sm text-muted-foreground">
            No signature saved yet. Add one so it can be reused in future
            monitorings.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
