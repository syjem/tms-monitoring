'use client';

import type { OperationResult } from '@/utils/with-error-handler';
import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type SignatureData = OperationResult<
  string | null | undefined,
  Record<string, unknown>
>;

const SignatureContext = createContext<SignatureData | undefined>(undefined);

type SignatureProviderProps = {
  signature: SignatureData;
  children: ReactNode;
};

export function SignatureProvider({
  signature,
  children,
}: SignatureProviderProps) {
  return (
    <SignatureContext.Provider value={signature}>
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignature() {
  const context = useContext(SignatureContext);

  if (!context) {
    throw new Error('useSignature must be used within a SignatureProvider');
  }

  return context;
}
