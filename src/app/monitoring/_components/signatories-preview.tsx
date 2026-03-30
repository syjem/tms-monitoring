'use client';

import { useSignature } from '@/app/monitoring/_components/signature-context';
import { OperationResult } from '@/utils/with-error-handler';
import Image from 'next/image';

type Signatory = {
  id: number;
  name: string;
  title: string;
  includeSignature: boolean;
};

type SignatoriesPreviewProps = {
  signatories: OperationResult<Signatory[], Record<string, unknown>>;
};

type SignatoryCardProps = {
  signatory: Signatory | null;
};

export function SignatoriesPreview({ signatories }: SignatoriesPreviewProps) {
  const data = signatories.success ? signatories.data : [];
  const firstSignatory = data.find((s) => s.id === 1) ?? null;
  const secondSignatory = data.find((s) => s.id === 2) ?? null;

  return (
    <footer className="mx-auto flex max-w-4xl justify-between gap-4 print:max-w-[700px]">
      <SignatoryCard signatory={firstSignatory} />
      <SignatoryCard signatory={secondSignatory} />
    </footer>
  );
}

function SignatoryCard({ signatory }: SignatoryCardProps) {
  const signature = useSignature();

  return (
    <div className="relative flex flex-col items-stretch max-w-1/2 px-2 md:px-8 print:px-8 py-4 rounded-sm">
      {signature.success &&
        signature.data &&
        signatory?.includeSignature &&
        signatory.name && (
          <Image
            src={signature.data}
            alt="Engineer Signature"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            width={180}
            height={108}
          />
        )}

      <h5 className="min-h-7 text-center text-base font-semibold md:text-2xl print:text-xl">
        {signatory?.name ?? ''}
      </h5>
      <p className="min-h-5 text-center text-xs text-gray-700 md:text-sm">
        {signatory?.title ?? ''}
      </p>
    </div>
  );
}
