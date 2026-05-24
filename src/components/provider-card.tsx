import { cn } from '@/lib/utils';
import Image, { type ImageProps } from 'next/image';

export type ExtractionProvider = 'gemini' | 'claude';

export function ProviderCard({
  value,
  label,
  selectedValue,
  onSelect,
  disabled,
  logoSrc,
}: {
  value: ExtractionProvider;
  label: string;
  selectedValue: ExtractionProvider;
  onSelect: (provider: ExtractionProvider) => void;
  disabled: boolean;
  logoSrc: ImageProps['src'];
}) {
  const isSelected = selectedValue === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={label}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(value);
      }}
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70',
        !disabled && 'hover:border-indigo-500',
        isSelected
          ? 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm'
          : 'border-gray-200 bg-white text-gray-700',
        disabled && 'cursor-not-allowed opacity-70',
      )}
    >
      <div
        className={cn(
          'flex size-7 items-center justify-center rounded-md',
          isSelected ? 'bg-white' : 'bg-gray-100',
        )}
      >
        <Image
          src={logoSrc}
          alt={label}
          width={16}
          height={16}
          className="h-4 w-4"
          unoptimized
        />
      </div>
      <span className="doc-subtitle text-sm">{label}</span>
    </button>
  );
}
