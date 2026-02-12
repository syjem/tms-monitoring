'use client';

import { deleteWorkLog } from '@/app/actions/logs/delete-work-log';
import { ERRORS } from '@/constants/errors';
import { EmptyFileManager } from '@/components/file-manager-empty';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WorkLog } from '@/lib/supabase/schema';
import { cn } from '@/lib/utils';
import { formatISODate } from '@/utils/format-date';
import { CheckCheck, CircleAlert, Ellipsis, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

function FileManager({ logs }: { logs: WorkLog[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const deleteLogHandler = async (id: string) => {
    const toastId = toast.warning('Deleting log...', {
      icon: <Loader className="h-4 w-4 animate-spin" />,
    });

    try {
      const result = await deleteWorkLog(id);

      if (!result.success) {
        if (result.error.code === 'UNAUTHORIZED') {
          toast.error(ERRORS.SESSION_EXPIRED, { id: toastId });
          router.replace('/auth/login');
          return;
        }

        throw new Error(result.error.message || ERRORS.NOT_ALLOWED);
      }

      toast.success('Log deleted successfully', {
        id: toastId,
        icon: <CheckCheck className="h-4 w-4" />,
      });
      router.refresh();
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

  const alertHandler = (value: boolean) => {
    setOpen(value);
  };

  return (
    <section className="rounded-lg border-2 border-dashed bg-white transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md">
      <DeleteAlertDialog
        open={open}
        setOpen={alertHandler}
        id={selectedId}
        deleteLogHandler={deleteLogHandler}
      />

      {logs && logs.length === 0 ? (
        <EmptyFileManager visible={visible} />
      ) : (
        <div
          className={cn(
            'p-6 transition-all duration-500 ease-out',
            visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
        >
          <Table>
            <TableCaption>Your recent logs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] font-bold">From — To</TableHead>
                <TableHead className="font-bold">Last modified</TableHead>
                <TableHead className="sr-only">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {log.period}
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {formatISODate(log.updated_at)}
                  </TableCell>

                  <TableCell className="flex items-center justify-center rounded-full p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/monitoring/${log.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(log.id);
                            alertHandler(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default FileManager;

function DeleteAlertDialog({
  open,
  setOpen,
  id,
  deleteLogHandler,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  id: string | null;
  deleteLogHandler: (id: string) => Promise<void>;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your data
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={async () => {
              if (id) await deleteLogHandler(id);
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
