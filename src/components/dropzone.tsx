'use client';

import { useEffect, useState, type ComponentType, type RefObject } from 'react';

import type { ExtractionProvider } from '@/app/actions/extract-pdf';
import { ExtractionAnimation } from '@/components/extraction-animation';
import { ClaudeLogo, GeminiLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from '@/components/ui/empty';
import { usePDFExtract } from '@/hooks/use-pdf-extract';
import { cn } from '@/lib/utils';
import type { AttendanceDefaults } from '@/types';
import { formatBytes } from '@/utils/format-bytes';
import { FileText, ScanLine, Upload, X } from 'lucide-react';

export function Dropzone({
  attendanceDefaults,
}: {
  attendanceDefaults?: AttendanceDefaults;
}) {
  const [provider, setProvider] = useState<ExtractionProvider>('gemini');

  const {
    files,
    setFiles,
    loading,
    stage,
    onExtract,
    maxFileSize,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
  } = usePDFExtract({
    allowedMimeTypes: ['application/pdf'],
    maxFiles: 1,
    maxFileSize: 1000 * 1000 * 5, // 5MB
    attendanceDefaults,
  });

  const file = files[0];
  const hasErrors = file?.errors && file.errors.length > 0;

  const handleRemoveFile = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div
      {...getRootProps({
        className: cn(
          'relative rounded-lg border-2 border-dashed bg-white p-8 transition-all duration-500',
          !file && 'border-gray-300 hover:border-gray-400 hover:shadow-md',
          file && !hasErrors && !loading && 'border-gray-300',
          loading && 'border-blue-400 bg-blue-50/50',
          hasErrors && 'border-red-400 bg-red-50/50',
          isDragActive && 'border-blue-400 bg-blue-50',
        ),
      })}
    >
      <label htmlFor="dropzone-input" className="sr-only">
        Dropzone Input
      </label>
      <input {...getInputProps()} id="dropzone-input" />

      {/* Uploading Progress */}
      {loading && stage && <ExtractionAnimation stage={stage} />}

      {/* File Display */}
      {file ? (
        <div
          className={cn(
            'transition-all duration-500',
            file ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
          )}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-full flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="rounded bg-green-100 p-2">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  {hasErrors ? (
                    <p className="text-xs text-red-600">
                      {file.errors
                        .map((e) =>
                          e.message.startsWith('File is larger than')
                            ? `File is larger than ${formatBytes(
                                maxFileSize,
                                2,
                              )} (Size: ${formatBytes(file.size, 2)})`
                            : e.message.startsWith('File type must be')
                              ? 'File type not allowed'
                              : e.message,
                        )
                        .join(', ')}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {formatBytes(file.size, 2)}
                    </p>
                  )}
                </div>
              </div>
              {!loading && (
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              {loading && (
                <div className="text-blue-600 animate-pulse">
                  <ScanLine className="h-5 w-5" />
                </div>
              )}
            </div>

            <div className="w-full space-y-2">
              <div
                role="radiogroup"
                aria-label="Select AI provider"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <ProviderOptionCard
                  value="gemini"
                  label="Gemini"
                  selectedValue={provider}
                  onSelect={setProvider}
                  disabled={loading}
                  Logo={GeminiLogo}
                />
                <ProviderOptionCard
                  value="claude"
                  label="Claude"
                  selectedValue={provider}
                  onSelect={setProvider}
                  disabled={loading}
                  Logo={ClaudeLogo}
                />
              </div>
            </div>

            {/* Upload Button */}
            {!loading && !hasErrors && (
              <Button
                onClick={() => onExtract(provider)}
                className="w-full text-white animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                Upload
              </Button>
            )}
          </div>
        </div>
      ) : (
        <DropzoneEmptyState inputRef={inputRef} maxFileSize={maxFileSize} />
      )}
    </div>
  );
}

function ProviderOptionCard({
  value,
  label,
  selectedValue,
  onSelect,
  disabled,
  Logo,
}: {
  value: ExtractionProvider;
  label: string;
  selectedValue: ExtractionProvider;
  onSelect: (provider: ExtractionProvider) => void;
  disabled: boolean;
  Logo: ComponentType<{ className?: string }>;
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70',
        !disabled && 'hover:border-sky-500',
        isSelected
          ? 'border-sky-500 bg-sky-50 text-sky-900 shadow-sm'
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
        <Logo className="h-4 w-4" />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function DropzoneEmptyState({
  inputRef,
  maxFileSize,
}: {
  inputRef: RefObject<HTMLInputElement>;
  maxFileSize: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Empty
      className={cn(
        'transition-all duration-500 ease-out',
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
      )}
    >
      <EmptyHeader className="space-y-2">
        <EmptyMedia variant="icon">
          <Upload className="size-4" />
        </EmptyMedia>
        <EmptyDescription>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Drag and drop or{' '}
              <button
                onClick={() => inputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 underline font-medium"
              >
                select pdf
              </button>{' '}
              to upload
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Max file size: {formatBytes(maxFileSize, 2)}
            </p>
          </div>
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
