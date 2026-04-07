'use client';

import { cn } from '@/lib/utils';
import { FileText, Save, ScanLine } from 'lucide-react';
import { useEffect, useState } from 'react';

type ExtractionStage = 'uploading' | 'extracting' | 'saving';

interface ExtractionAnimationProps {
  stage: ExtractionStage;
}

export function ExtractionAnimation({ stage }: ExtractionAnimationProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    let max = 100;
    let speed = 1;

    if (stage === 'extracting') {
      max = 99;
      speed = 100;
    }

    if (stage === 'saving') {
      max = 100;
      speed = 30;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= max) return prev;
        return prev + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [stage]);

  const stages = [
    {
      id: 'uploading',
      label: 'Uploading',
      description: 'Sending your PDF to the server',
      icon: FileText,
    },
    {
      id: 'extracting',
      label: 'Extracting',
      description: 'Processing and extracting data',
      icon: ScanLine,
    },
    {
      id: 'saving',
      label: 'Saving',
      description: 'Saving the extracted data',
      icon: Save,
    },
  ] as const;

  const currentStageIndex = stages.findIndex((s) => s.id === stage);

  const extractStageStyle = {
    uploading: {
      container: 'border-cyan-500/20 bg-cyan-500/5',
      pulse: 'bg-cyan-400/40',
      text: 'text-cyan-700 dark:text-cyan-300',
    },
    extracting: {
      container: 'border-purple-500/20 bg-purple-500/5',
      pulse: 'bg-purple-400/40',
      text: 'text-purple-700 dark:text-purple-300',
    },
    saving: {
      container: 'border-emerald-500/20 bg-emerald-500/5',
      pulse: 'bg-emerald-400/40',
      text: 'text-emerald-700 dark:text-emerald-300',
    },
  }[stage];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            Processing Your PDF
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please wait while we extract your data
          </p>
        </div>

        {/* Progress Stages */}
        <div className="space-y-6">
          {stages.map((stageItem, index) => {
            const Icon = stageItem.icon;
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;

            return (
              <div key={stageItem.id} className="relative">
                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-5 top-12 h-12 w-0.5 transition-colors duration-500',
                      isCompleted
                        ? 'bg-primary'
                        : isActive
                          ? 'bg-primary/50'
                          : 'bg-muted',
                    )}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500',
                      isCompleted
                        ? 'bg-primary text-white'
                        : isActive
                          ? 'animate-in bg-primary text-white shadow-lg shadow-primary/50'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon
                      className={cn('h-5 w-5', isActive && 'animate-pulse')}
                    />
                  </div>

                  {/* Stage Info */}
                  <div className="flex-1 space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <h3
                        className={cn(
                          'font-semibold transition-colors',
                          isActive || isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground',
                        )}
                      >
                        {stageItem.label}
                      </h3>
                      {isCompleted && (
                        <span className="text-xs font-medium text-primary">
                          ✓ Complete
                        </span>
                      )}
                      {isActive && (
                        <span className="text-xs font-medium text-primary">
                          {progress}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stageItem.description}
                    </p>

                    {/* Progress Bar */}
                    {isActive && (
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary transition-all duration-300 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Message */}
        <div
          className={cn(
            'relative overflow-hidden rounded-md border p-4 text-center',
            extractStageStyle.container,
          )}
        >
          <div
            className={cn(
              'pointer-events-none absolute inset-y-0 -right-1/2 w-1/2 rounded-md opacity-60',
              extractStageStyle.pulse,
            )}
            style={{
              animation: 'extracting-shimmer 2.2s linear infinite',
              filter: 'blur(24px)',
            }}
          />
          <p className={cn('relative text-sm', extractStageStyle.text)}>
            {stage === 'uploading' && 'Uploading your file securely...'}
            {stage === 'extracting' &&
              'Analyzing and extracting PDF content...'}
            {stage === 'saving' && 'Almost there!'}
          </p>
        </div>
      </div>
    </div>
  );
}
