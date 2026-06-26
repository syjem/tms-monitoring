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
    <div className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full items-center justify-between border-b border-slate-300 bg-slate-100/95 px-4 py-2 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.45)] print:hidden sm:inset-x-auto sm:top-4 sm:right-4 sm:max-w-62.5 sm:rounded-md sm:border sm:border-slate-200 sm:bg-slate-50/80 sm:p-2 sm:shadow-none">
      <p className="text-xs font-medium tracking-wide text-slate-500">
        Page {activePage + 1} / {pageCount}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActivePage((prev) => Math.max(0, prev - 1))}
          disabled={activePage === 0}
          className="text-slate-600 motion-safe:transition-[transform,color,background-color] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
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
          className="text-slate-600 motion-safe:transition-[transform,color,background-color] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={addPage}
        disabled={!isEditable}
        className="motion-safe:transition-[transform,background-color,border-color] motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
      >
        <FilePlus2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default AddPage;
