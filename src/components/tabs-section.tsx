'use client';

import { getWorkLogs } from '@/app/actions/logs/get-work-logs';
import { Dropzone } from '@/components/dropzone';
import FileManager from '@/components/file-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useTransition } from 'react';

type WorkLogListItem = {
  id: string;
  period: string;
  updated_at: Date | string;
};

export function TabsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'upload';

  const [tab, setTab] = useState(currentTab);
  const [isPending, startTransition] = useTransition();
  const [logs, setLogs] = useState<WorkLogListItem[]>([]);
  const [hasLoadedLogs, setHasLoadedLogs] = useState(false);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const loadLogs = useCallback(
    async (force = false) => {
      if (isLogsLoading) return;
      if (hasLoadedLogs && !force) return;

      setIsLogsLoading(true);
      setLogsError(null);

      try {
        const workLogs = await getWorkLogs();
        setLogs(workLogs);
        setHasLoadedLogs(true);
      } catch {
        setLogsError('Unable to load work logs right now.');
      } finally {
        setIsLogsLoading(false);
      }
    },
    [hasLoadedLogs, isLogsLoading],
  );

  useEffect(() => {
    setTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (tab !== 'files' || hasLoadedLogs) return;
    void loadLogs();
  }, [tab, hasLoadedLogs, loadLogs]);

  useEffect(() => {
    // Start loading Files data in idle time
    if (hasLoadedLogs) return;

    if (typeof globalThis.requestIdleCallback === 'function') {
      const idleId = globalThis.requestIdleCallback(
        () => {
          void loadLogs();
        },
        { timeout: 1500 },
      );

      return () => globalThis.cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(() => {
      void loadLogs();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [hasLoadedLogs, loadLogs]);

  const handleTabChange = (value: string) => {
    setTab(value);

    if (value === 'files') {
      // Ensure Files tab can fetch immediately on click, without waiting for idle time
      void loadLogs();
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('tab', value);

      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl);
    });
  };

  // Avoid flash of empty state
  const shouldShowLogsLoading =
    isLogsLoading || (tab === 'files' && !hasLoadedLogs && !logsError);

  return (
    <section className="mt-6 max-w-xl mx-auto px-4">
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
          <Dropzone />
        </TabsContent>

        <TabsContent value="files">
          <FileManager
            logs={logs}
            isLoading={shouldShowLogsLoading}
            error={logsError}
            onRefreshLogs={async () => {
              await loadLogs(true);
            }}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
