'use client';

import { extractTextFromPDF } from '@/app/actions/extract-pdf';
import type { ExtractionProvider } from '@/app/actions/extract-pdf';
import { createLog } from '@/app/actions/logs/create-log';
import { FALLBACK_ATTENDANCE_DEFAULTS } from '@/constants/attendance-defaults';
import type { AttendanceDefaults } from '@/types';
import { isNextRedirectError } from '@/utils/is-next-redirect-error';
import { processLogs } from '@/utils/process-logs';
import { useCallback, useEffect, useState } from 'react';
import {
  type FileError,
  type FileRejection,
  useDropzone,
} from 'react-dropzone';
import { toast } from 'sonner';

/* ------------------------- Types & Interfaces ------------------------- */

interface FileWithPreview extends File {
  preview?: string;
  errors: readonly FileError[];
}

type UsePDFExtractOptions = {
  allowedMimeTypes?: string[];
  maxFileSize?: number;
  maxFiles?: number;
  attendanceDefaults?: AttendanceDefaults;
};

type ExtractionStage = 'uploading' | 'extracting' | 'saving' | null;

export const usePDFExtract = (options: UsePDFExtractOptions) => {
  const {
    allowedMimeTypes = ['application/pdf'],
    maxFileSize = Number.POSITIVE_INFINITY,
    maxFiles = 1,
    attendanceDefaults = FALLBACK_ATTENDANCE_DEFAULTS,
  } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name: string; message: string }[]>([]);
  const [stage, setStage] = useState<ExtractionStage>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validFiles = acceptedFiles
        .filter((file) => !files.find((x) => x.name === file.name))
        .map((file) => {
          (file as FileWithPreview).preview = URL.createObjectURL(file);
          (file as FileWithPreview).errors = [];
          return file as FileWithPreview;
        });

      const invalidFiles = fileRejections.map(({ file, errors }) => {
        (file as FileWithPreview).preview = URL.createObjectURL(file);
        (file as FileWithPreview).errors = errors;
        return file as FileWithPreview;
      });

      setFiles([...files, ...validFiles, ...invalidFiles]);
    },
    [files],
  );

  const {
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    ...restDropzoneProps
  } = useDropzone({
    onDrop,
    noClick: true,
    accept: allowedMimeTypes.reduce(
      (acc, type) => ({ ...acc, [type]: [] }),
      {},
    ),
    maxSize: maxFileSize,
    maxFiles,
    multiple: maxFiles !== 1,
  });

  const onExtract = useCallback(
    async (provider: ExtractionProvider = 'gemini') => {
      if (files.length === 0) return;

      setLoading(true);
      setErrors([]);

      setStage('uploading');
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        setStage('extracting');
        const result = await extractTextFromPDF(files[0], provider);

        if (!result.success) {
          toast.error(result.error || 'Extraction failed');
          return;
        }

        const period = `${result.data.from} — ${result.data.to}`;

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
        setLoading(false);
      }
    },
    [attendanceDefaults, files],
  );

  useEffect(() => {
    if (files.length === 0) {
      setErrors([]);
    }
  }, [files.length]);

  return {
    files,
    setFiles,
    loading,
    stage,
    errors,
    onExtract,
    maxFileSize,
    maxFiles,
    getRootProps,
    getInputProps,
    inputRef,
    isDragActive,
    ...restDropzoneProps,
  };
};
