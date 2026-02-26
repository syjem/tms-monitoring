'use client';

import { Dropzone } from '@/components/dropzone';
import FileManager from '@/components/file-manager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

type MainTabProps = {
  logs: {
    id: string;
    period: string;
    updated_at: Date;
  }[];
};

export function MainTab({ logs }: MainTabProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get('tab') || 'upload';

  const [tab, setTab] = useState(currentTab);
  const [isPending, startTransition] = useTransition();

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

  return (
    <Tabs value={tab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="upload" className="px-4 py-2" disabled={isPending}>
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
        <FileManager logs={logs} />
      </TabsContent>
    </Tabs>
  );
}
