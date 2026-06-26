import { getProfile } from '@/actions/profiles/get-profile';
import { DefaultsPanel } from '@/components/settings/defaults';
import { SignatoriesPanel } from '@/components/settings/signatories-panel';
import { SignaturePanel } from '@/components/settings/signature-panel';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defults';
import { SignatureProvider } from '@/contexts/signature';
import type { AttendanceDefaults } from '@/types';
import type { OperationResult } from '@/utils/error-handler';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  const profile = await getProfile();

  if (!profile.success) {
    throw new Error(profile.error.message);
  }

  const signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  > = {
    success: true,
    data: profile.data?.signature,
  };

  const signatories: OperationResult<
    {
      id: number;
      name: string;
      title: string;
      includeSignature: boolean;
    }[],
    Record<string, unknown>
  > = {
    success: true,
    data: profile.data?.signatories ?? [],
  };

  const defaults: AttendanceDefaults = {
    destination:
      profile.data?.defaultDestination ??
      FALLBACK_ATTENDANCE_DEFAULTS.destination,
    remarks:
      profile.data?.defaultRemarks ?? FALLBACK_ATTENDANCE_DEFAULTS.remarks,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="mb-8 text-center">
        <h1 className="doc-title mt-3 text-2xl md:text-3xl w-1/2 mx-auto md:w-full">
          Manage your App Settings
        </h1>
        <p className="doc-body mx-auto mt-3 max-w-2xl text-sm md:text-base">
          Update your signature, signatories, and monitoring defaults in one
          place.
        </p>
      </section>

      <SignatureProvider signature={signature}>
        <div className="space-y-6">
          <SignaturePanel />
          <SignatoriesPanel signatories={signatories} />
          <DefaultsPanel defaults={defaults} />
        </div>
      </SignatureProvider>
    </main>
  );
}
