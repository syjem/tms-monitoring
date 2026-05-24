'use client';

import DocumentsManager from '@/components/document-manager';
import Dropzone from '@/components/dropzone';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDefaults } from '@/hooks/use-defaults';
import { getLogsQueryOptions, LOGS_QUERY_KEY, useLogs } from '@/hooks/use-logs';
import { useQueryClient } from '@tanstack/react-query';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useOptimistic, useTransition } from 'react';

const VALID_TABS = ['upload', 'documents'] as const;
type TabValue = (typeof VALID_TABS)[number];

export default function HomeTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tab = searchParams.get('tab') || 'upload';
  const [activeTab, setActiveTab] = useOptimistic<TabValue>(
    tab === 'documents' ? 'documents' : 'upload',
  );

  const {
    logs,
    error,
    isLoading,
    isFetching,
    refetch: refetchLogs,
  } = useLogs(activeTab === 'documents');
  const { defaults } = useDefaults();

  const queryClient = useQueryClient();

  const shouldShowLogsLoading =
    activeTab === 'documents' &&
    (isLoading || (isFetching && logs.length === 0));
  const logsError = error instanceof Error ? error.message : null;

  useEffect(() => {
    const queryState = queryClient.getQueryState(LOGS_QUERY_KEY);
    if (
      queryState?.status === 'success' ||
      queryState?.fetchStatus === 'fetching'
    )
      return;

    if (typeof globalThis.requestIdleCallback === 'function') {
      const idleId = globalThis.requestIdleCallback(
        () => {
          void queryClient.prefetchQuery(getLogsQueryOptions());
        },
        { timeout: 1500 },
      );

      return () => globalThis.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => {
      void queryClient.prefetchQuery(getLogsQueryOptions());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [queryClient]);

  const handleTabChange = (value: string) => {
    if (!VALID_TABS.includes(value as TabValue)) return;

    const nextTab = value as TabValue;

    startTransition(() => {
      setActiveTab(nextTab);
      const params = new URLSearchParams(searchParams);
      params.set('tab', nextTab);
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <section className="mt-8 max-w-xl mx-auto px-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger
            value="upload"
            className="doc-subtitle px-4 py-2 text-sm"
            disabled={isPending && activeTab !== 'upload'}
          >
            Upload
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="doc-subtitle px-4 py-2 text-sm"
            disabled={isPending && activeTab !== 'documents'}
          >
            Documents
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Dropzone attendanceDefaults={defaults} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentsManager
            logs={logs}
            isLoading={shouldShowLogsLoading}
            error={logsError}
            onRefreshLogs={async () => {
              await refetchLogs();
            }}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
