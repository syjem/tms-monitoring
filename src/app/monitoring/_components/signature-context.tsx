'use client';

import type { OperationResult } from '@/utils/with-error-handler';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useMemo, useState } from 'react';

export type SignatureData = OperationResult<
  string | null | undefined,
  Record<string, unknown>
>;

type SignatureContextValue = {
  signature: SignatureData;
  setSignature: Dispatch<SetStateAction<SignatureData>>;
};

const SignatureContext = createContext<SignatureContextValue | undefined>(
  undefined,
);

type SignatureProviderProps = {
  signature: SignatureData;
  children: ReactNode;
};

export function SignatureProvider({
  signature: initialSignature,
  children,
}: SignatureProviderProps) {
  const [signature, setSignature] = useState(initialSignature);
  const value = useMemo(
    () => ({
      signature,
      setSignature,
    }),
    [signature],
  );

  return (
    <SignatureContext.Provider value={value}>
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignature() {
  const context = useContext(SignatureContext);

  if (!context) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }

  return context.signature;
}

export function useSetSignature() {
  const context = useContext(SignatureContext);

  if (!context) {
    throw new Error('useSetSignature must be used within a SignatureProvider');
  }

  return context.setSignature;
}
