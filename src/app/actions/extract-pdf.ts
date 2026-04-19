'use server';

import { getUser } from '@/app/actions/get-user';
import { REDIS } from '@/lib/upstash/config';
import {
  checkMonthlyExtractionQuota,
  consumeMonthlyExtractionQuota,
} from '@/lib/upstash/utils';
import { validatePDF } from '@/utils/is-valid-pdf';

export type ExtractionProvider = 'gemini' | 'claude';

export async function extractTextFromPDF(
  file: File,
  provider: ExtractionProvider,
) {
  if (!provider) {
    return { success: false, error: 'No provider specified' };
  }

  // File Validation
  const result = await validatePDF(file);

  if (!result.valid) {
    return { success: false, error: result.error };
  }

  try {
    const user = await getUser();

    // READ-ONLY quota check
    const quota = await checkMonthlyExtractionQuota(user.id);

    if (!quota.allowed) {
      return {
        success: false,
        error: `Monthly limit reached. You can only upload ${REDIS.MONTHLY_EXTRACTION_LIMIT} PDFs per month.`,
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('provider', provider);

    const url = 'https://api-tms-monitoring.vercel.app/api/extract';
    const extractApiKey = process.env.EXTRACT_API_KEY!;

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

    // CONSUME quota after successful extraction
    await consumeMonthlyExtractionQuota(user.id);

    return { success: true, data };
  } catch (error) {
    console.error('Extraction error:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Unable to process extraction request',
    };
  }
}
