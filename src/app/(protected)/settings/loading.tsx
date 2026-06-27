import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FilePenLine, Layers2, Signature } from 'lucide-react';

export default function Loading() {
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

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Signature className="size-4 text-primary" />
                <CardTitle className="doc-subtitle">Signature</CardTitle>
              </div>
              <CardDescription className="doc-caption">
                Update the signature used in your monitoring sheets and
                signatory blocks.
              </CardDescription>
            </div>
            <CardAction>
              <Skeleton className="h-9 w-36 rounded-md" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-55 w-full rounded-lg" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FilePenLine className="size-4 text-primary" />
                <CardTitle className="doc-subtitle">Signatories</CardTitle>
              </div>
              <CardDescription className="doc-caption">
                Manage the two signatory slots that appear at the bottom of your
                monitoring sheets.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <SignatorySlotSkeleton label="First Signatory" />
              <SignatorySlotSkeleton label="Second Signatory" />
            </div>
          </CardContent>
        </Card>

        <section className="rounded-lg border border-gray-200 bg-white/90 p-4 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers2 className="size-4 text-primary" />
                <p className="doc-subtitle text-sm">Defaults</p>
              </div>
              <p className="doc-caption">
                Change your destination and remarks&apos; defaults.
              </p>
            </div>

            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="doc-caption font-medium uppercase">Destination</p>
              <Skeleton className="mt-2 h-5 w-28" />
            </div>

            <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
              <p className="doc-caption font-medium uppercase">Remarks</p>
              <Skeleton className="mt-2 h-5 w-36" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignatorySlotSkeleton({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 shadow-sm transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="doc-caption font-medium uppercase">{label}</p>
          <p className="doc-caption mt-1 text-sm">No signatory assigned yet.</p>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
      </div>

      <div className="mt-6 flex min-h-45 items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6">
        <div className="w-full space-y-3">
          <Skeleton className="h-5 w-40 mx-auto" />
          <Skeleton className="h-4 w-28 mx-auto" />
        </div>
      </div>
    </div>
  );
}
