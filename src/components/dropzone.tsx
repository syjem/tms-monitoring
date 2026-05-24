'use client';

import anthropicLogo from '#public/anthropic.png';
import geminiLogo from '#public/gemini.png';
import { createLog } from '@/actions/logs/create';
import { uploadPDFFile } from '@/actions/upload-pdf';
import {
  ProviderCard,
  type ExtractionProvider,
} from '@/components/provider-card';
import { Button } from '@/components/ui/button';
import { UploadingAnimation } from '@/components/uploading-animation';
import { AttendanceDefaults } from '@/constants/attendance-defults';
import { cn } from '@/lib/utils';
import { formatFileSize } from '@/utils/format-file-size';
import { isNextRedirectError } from '@/utils/is-next-redirect';
import { processLogs } from '@/utils/process-logs';
import {
  Cancel01Icon,
  File01Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
type ExtractionStage = 'uploading' | 'extracting' | 'saving' | null;

export default function Dropzone({
  attendanceDefaults,
}: {
  attendanceDefaults: AttendanceDefaults;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ExtractionProvider>('gemini');
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState<ExtractionStage>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadError(null);
    setSelectedFile(file);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open: openFilePicker,
  } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_UPLOAD_SIZE,
    noClick: true,
    onDrop,
    onDropRejected: (fileRejections) => {
      const firstError = fileRejections[0]?.errors[0];

      if (!firstError) {
        setUploadError('Unable to upload file.');
        return;
      }

      if (firstError.code === 'file-invalid-type') {
        setUploadError('Only PDF files are allowed.');
        return;
      }

      if (firstError.code === 'file-too-large') {
        setUploadError('File is too large. Max size is 5 MB.');
        return;
      }

      if (firstError.code === 'too-many-files') {
        setUploadError('Only one file can be uploaded.');
        return;
      }

      setUploadError(firstError.message);
    },
  });

  const handleUpload = useCallback(
    async (provider: ExtractionProvider = 'gemini') => {
      if (!selectedFile) return;

      setUploading(true);
      setUploadError(null);
      setStage('uploading');
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        setStage('extracting');
        const result = await uploadPDFFile(selectedFile, provider);

        if (!result.success) {
          toast.error(result.error || 'Extraction failed');
          return;
        }

        const period = `${result.data.from}/${result.data.to}`;
        const processedLogs = processLogs(result.data.logs, attendanceDefaults);

        setStage('saving');
        await createLog(period, processedLogs);
      } catch (error: unknown) {
        if (isNextRedirectError(error)) return;
        toast.error(
          error instanceof Error
            ? error.message
            : 'Something went wrong during PDF processing',
        );
      } finally {
        setUploading(false);
        setStage(null);
      }
    },
    [selectedFile, attendanceDefaults],
  );

  return (
    <React.Fragment>
      {uploading && stage && <UploadingAnimation stage={stage} />}
      <section
        className={cn(
          'rounded-lg border-2 border-dashed p-8 text-center motion-safe:transition-[border-color,background-color,transform,opacity] motion-safe:duration-200 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)]',
          selectedFile
            ? 'border-blue-300/50 bg-blue-50/30 dark:border-blue-500/40 dark:bg-blue-500/10'
            : uploadError
              ? 'border-red-300/50 bg-red-50/30 dark:border-red-500/40 dark:bg-red-500/10'
              : isDragActive
                ? 'border-emerald-300/50 bg-emerald-50/40 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                : 'border-border bg-background',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
      >
        {selectedFile ? (
          <React.Fragment>
            <div className="w-full flex items-center justify-between gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start gap-3 min-w-0">
                <div className="rounded-md border bg-primary/20 p-2 text-primary">
                  <HugeiconsIcon
                    icon={File01Icon}
                    strokeWidth={2}
                    className="size-4"
                  />
                </div>
                <div className="min-w-0">
                  <p className="doc-subtitle truncate text-sm">
                    {selectedFile.name}
                  </p>
                  <p className="doc-caption text-start">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove file"
                className="motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
                onClick={() => setSelectedFile(null)}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </Button>
            </div>

            <div className="w-full space-y-2 mt-4">
              <div
                role="radiogroup"
                aria-label="Select AI provider"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <ProviderCard
                  value="gemini"
                  label="Gemini"
                  selectedValue={provider}
                  onSelect={setProvider}
                  disabled={uploading}
                  logoSrc={geminiLogo}
                />
                <ProviderCard
                  value="claude"
                  label="Anthropic"
                  selectedValue={provider}
                  onSelect={setProvider}
                  disabled={uploading}
                  logoSrc={anthropicLogo}
                />
              </div>
            </div>

            <Button
              type="button"
              className="mt-4 w-full text-white animate-in fade-in slide-in-from-bottom-2 duration-500"
              onClick={() => handleUpload(provider)}
            >
              Upload
            </Button>
          </React.Fragment>
        ) : (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full border bg-muted">
              <HugeiconsIcon
                icon={Upload01Icon}
                strokeWidth={2}
                className="size-4"
              />
            </div>
            <p className="doc-subtitle text-sm">
              {isDragActive ? 'Drop here' : 'Drag and drop your file here'}
            </p>
            <p className="doc-caption mt-1">
              PDF only, max 1 file, up to 5 MB.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
              onClick={openFilePicker}
            >
              Choose File
            </Button>
            {uploadError && (
              <p className="mt-3 text-xs leading-5 text-destructive">
                {uploadError}
              </p>
            )}
          </div>
        )}
      </section>
    </React.Fragment>
  );
}
