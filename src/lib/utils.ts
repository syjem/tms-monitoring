import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadPDF(formData: FormData, extractApiKey: string) {
  const url = 'https://api-tms-monitoring.vercel.app/api/extract';

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${extractApiKey}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return { success: false, error: data?.error || 'Extraction failed' };
  }

  return { success: true, data };
}
