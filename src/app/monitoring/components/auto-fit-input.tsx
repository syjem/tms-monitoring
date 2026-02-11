import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef } from 'react';

interface AutoFitInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  minFontSize?: number;
  maxFontSize?: number;
}

export function AutoFitInput({
  value,
  className,
  minFontSize = 8,
  maxFontSize = 12,
  ...props
}: AutoFitInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fitText = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;

    const style = window.getComputedStyle(el);
    const fontStyle = style.fontStyle;
    const fontWeight = style.fontWeight;
    const fontFamily = style.fontFamily;
    const text = String(value ?? '');
    const availableWidth = Math.max(el.clientWidth - 4, 0);

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    if (!text) {
      el.style.fontSize = `${maxFontSize}px`;
      return;
    }

    let fontSize = maxFontSize;

    while (fontSize >= minFontSize) {
      context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      const textWidth = context.measureText(text).width;

      if (textWidth <= availableWidth) break;

      fontSize -= 0.5;
    }

    el.style.fontSize = `${fontSize}px`;
  }, [value, minFontSize, maxFontSize]);

  useEffect(() => {
    fitText();
  }, [value, fitText]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => fitText());
    observer.observe(el);

    return () => observer.disconnect();
  }, [fitText]);

  useEffect(() => {
    const runFit = () => fitText();

    const media = window.matchMedia('print');
    const onMediaChange = () => runFit();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onMediaChange);
    }

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', onMediaChange);
      }
    };
  }, [fitText]);

  return (
    <input
      ref={inputRef}
      value={value}
      {...props}
      className={cn(
        'w-full h-full border-none outline-none bg-transparent',
        className,
      )}
    />
  );
}
