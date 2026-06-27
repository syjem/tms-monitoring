import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { CloudUpload } from 'lucide-react';

export function EmptyDocumentManager({ visible }: { visible?: boolean }) {
  return (
    <Empty
      className={cn(
        'transition-all duration-500 ease-out',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
      )}
    >
      <EmptyHeader className="space-y-2">
        <EmptyMedia variant="icon">
          <CloudUpload className="size-4" />
        </EmptyMedia>
        <EmptyTitle>Logs Empty</EmptyTitle>
        <EmptyDescription>
          Upload your daily logs to see them here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
