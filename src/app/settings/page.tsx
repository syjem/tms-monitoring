import { getSignatories } from '@/app/actions/profiles/get-signatories';
import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import { SignatureProvider } from '@/app/monitoring/_components/signature-context';
import { AttendanceDefaultsPanel } from '@/components/attendance-defaults';
import { BackgroundBottom, BackgroundTop } from '@/components/backgrounds';
import { Header } from '@/components/header';
import { SignatoriesSettingsCard } from '@/components/signatories-settings-card';
import { SignatureSettingsCard } from '@/components/signature-settings-card';

export default async function SettingsPage() {
  const [signature, signatories] = await Promise.all([
    getEngineerSignature(),
    getSignatories(),
  ]);

  return (
    <>
      <BackgroundTop />
      <Header />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <section className="mb-8 text-center">
          <h1 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
            Manage your Profile Settings
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600 md:text-base">
            Update your signature, signatories, and attendance defaults in one
            place.
          </p>
        </section>

        <SignatureProvider signature={signature}>
          <div className="space-y-6">
            <SignatureSettingsCard initialSignature={signature} />
            <SignatoriesSettingsCard signatories={signatories} />
            <AttendanceDefaultsPanel />
          </div>
        </SignatureProvider>
      </main>
      <BackgroundBottom />
    </>
  );
}
