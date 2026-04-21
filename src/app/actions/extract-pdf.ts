'use server';

import { getUser } from '@/app/actions/get-user';
import { CONFIG } from '@/lib/upstash/config';
import {
  checkMonthlyExtractionQuota,
  consumeMonthlyExtractionQuota,
} from '@/lib/upstash/utils';
import { uploadPDF } from '@/lib/utils';
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
        error: `Monthly limit reached. You can only upload ${CONFIG.MONTHLY_LIMIT} PDFs per month.`,
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('provider', provider);
    const extractApiKey = process.env.EXTRACT_API_KEY!;

    const response = await uploadPDF(formData, extractApiKey);

    if (!response.ok) {
      return { success: false, error: response.error };
    }

    // CONSUME quota after successful extraction
    await consumeMonthlyExtractionQuota(user.id);

    return { success: true, data: response.data };
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
