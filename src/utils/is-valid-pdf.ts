const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const PDF_MAGIC_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"

type PDFValidationResult = { valid: true } | { valid: false; error: string };

export const validatePDF = async (file: File): Promise<PDFValidationResult> => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    return { valid: false, error: 'Invalid file type, expected PDF.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${MAX_FILE_SIZE}MB.`,
    };
  }

  // Check magic bytes
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes.length < PDF_MAGIC_BYTES.length) {
    return { valid: false, error: 'File is too small to be a valid PDF.' };
  }

  const hasValidSignature = PDF_MAGIC_BYTES.every(
    (byte, i) => bytes[i] === byte,
  );

  if (!hasValidSignature) {
    return { valid: false, error: 'File does not appear to be a valid PDF.' };
  }

  return { valid: true };
};
