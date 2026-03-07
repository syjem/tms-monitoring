import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FilePlus2 } from 'lucide-react';
import { SetStateAction } from 'react';

type AddPageProps = {
  activePage: number;
  pageCount: number;
  setActivePage: (value: SetStateAction<number>) => void;
  addPage: () => void;
  isEditable: boolean;
};

function AddPage({
  activePage,
  pageCount,
  setActivePage,
  addPage,
  isEditable,
}: AddPageProps) {
  return (
    <div className="fixed top-4 right-4 flex max-w-4xl items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 p-2 space-x-2 print:hidden">
      <p className="text-xs font-medium tracking-wide text-slate-500">
        Page {activePage + 1} / {pageCount}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActivePage((prev) => Math.max(0, prev - 1))}
          disabled={activePage === 0}
          className="text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            setActivePage((prev) => Math.min(pageCount - 1, prev + 1))
          }
          disabled={activePage === pageCount - 1}
          className="text-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addPage}
        disabled={!isEditable}
      >
        <FilePlus2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default AddPage;
