'use client';

import { Dropzone } from '@/components/dropzone';
import FileManager from '@/components/file-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAttendanceDefaults } from '@/hooks/use-attendance-defaults';
import {
  getWorkLogsQueryOptions,
  useWorkLogs,
  WORK_LOGS_QUERY_KEY,
} from '@/hooks/use-work-logs';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function TabsSection() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'upload';

  const [tab, setTab] = useState(currentTab);
  const [isPending, startTransition] = useTransition();
  const { attendanceDefaults } = useAttendanceDefaults();
  const {
    logs,
    error,
    isLoading,
    isFetching,
    refetch: refetchLogs,
  } = useWorkLogs(tab === 'files');

  useEffect(() => {
    const queryState = queryClient.getQueryState(WORK_LOGS_QUERY_KEY);
    if (
      queryState?.status === 'success' ||
      queryState?.fetchStatus === 'fetching'
    )
      return;

    if (typeof globalThis.requestIdleCallback === 'function') {
      const idleId = globalThis.requestIdleCallback(
        () => {
          void queryClient.prefetchQuery(getWorkLogsQueryOptions());
        },
        { timeout: 1500 },
      );

      return () => globalThis.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => {
      void queryClient.prefetchQuery(getWorkLogsQueryOptions());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [queryClient]);

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  const handleTabChange = (value: string) => {
    setTab(value);

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', value);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    });
  };

  // Avoid flash of empty state
  const shouldShowLogsLoading =
    tab === 'files' && (isLoading || (isFetching && logs.length === 0));
  const logsError = error instanceof Error ? error.message : null;

  return (
    <section className="mt-8 max-w-xl mx-auto px-4">
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger
            value="upload"
            className="px-4 py-2"
            disabled={isPending}
          >
            Upload
          </TabsTrigger>
          <TabsTrigger value="files" className="px-4 py-2" disabled={isPending}>
            Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Dropzone attendanceDefaults={attendanceDefaults} />
        </TabsContent>

        <TabsContent value="files">
          <FileManager
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
