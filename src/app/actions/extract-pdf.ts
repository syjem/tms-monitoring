'use server';

export type ExtractionProvider = 'gemini' | 'claude';

export async function extractTextFromPDF(
  file: File,
  provider: ExtractionProvider,
) {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  if (!provider) {
    return { success: false, error: 'No provider specified' };
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('provider', provider);

  const url = 'https://api-tms-monitoring.vercel.app/api/extract';

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data?.error || 'Extraction failed' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Extraction error:', error);
    return { success: false, error: 'An error occurred during extraction' };
  }
}
