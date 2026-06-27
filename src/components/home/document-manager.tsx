'use client';

import { deleteLog } from '@/actions/logs/delete';
import DocumentTableDropdown from '@/components/home/document-table-dropdown';
import { EmptyDocumentManager } from '@/components/home/empty-document-manager';
import { LogsLoader } from '@/components/skeletons/logs';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { formatISODate } from '@/utils/format-date';
import { CheckCheck, CircleAlert, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type DocumentsManagerProps = {
  logs: {
    id: string;
    period: string;
    updated_at: Date | string;
  }[];
  isLoading?: boolean;
  error?: string | null;
  onRefreshLogs?: () => Promise<void>;
};

function DocumentsManager({
  logs,
  isLoading = false,
  error = null,
  onRefreshLogs,
}: DocumentsManagerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const deleteHandler = async (id: string) => {
    const toastId = toast.warning('Deleting log...', {
      icon: <Loader className="h-4 w-4 animate-spin" />,
    });

    try {
      await deleteLog(id);

      toast.success('Log deleted successfully', {
        id: toastId,
        icon: <CheckCheck className="h-4 w-4" />,
      });
      if (onRefreshLogs) await onRefreshLogs();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error has occurred, please try again!';

      toast.error(errorMessage, {
        id: toastId,
        icon: <CircleAlert className="h-4 w-4" />,
      });
    }
  };

  return (
    <section className="max-h-87.5 rounded-lg border-2 border-dashed bg-white transition-all duration-500 overflow-auto">
      {isLoading && logs.length === 0 ? (
        <LogsLoader />
      ) : error && logs.length === 0 ? (
        <div className="flex min-h-55 flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="doc-body text-sm">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              void onRefreshLogs?.();
            }}
          >
            Try again
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <EmptyDocumentManager visible={visible} />
      ) : (
        <div
          className={cn(
            'p-6 transition-all duration-500 ease-out',
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="doc-subtitle w-50 text-sm">
                  Period
                </TableHead>
                <TableHead className="doc-subtitle text-sm">
                  Last modified
                </TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="doc-subtitle text-sm">
                    {log.period}
                  </TableCell>
                  <TableCell className="doc-body text-sm">
                    {formatISODate(new Date(log.updated_at))}
                  </TableCell>

                  <TableCell className="flex items-center justify-center rounded-full p-2">
                    <DocumentTableDropdown
                      id={log.id}
                      deleteHandler={deleteHandler}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

export default DocumentsManager;
