import { Button } from '@/components/ui/button';
import { Signature, SignatureSettings } from '@/utils/classes/signature';
import { Loader, Save } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * SignaturePad Component
 *
 * A complete React component for capturing and managing digital signatures.
 * Provides a canvas for drawing signatures with save, clear, and export functionality.
 * Includes error handling, loading states, and toast notifications.
 *
 * @component
 * @description
 * - Manages signature capture with customizable styling
 * - Handles async save operations with loading state
 * - Provides user feedback via toast notifications
 * - Automatically initializes and cleans up the Signature class instance
 * - Validates signature data before saving
 *
 * @example
 * // Basic usage with default settings
 * <SignaturePad
 *   onSaveSignature={async (dataUrl) => {
 *     await fetch('/api/save-signature', {
 *       method: 'POST',
 *       body: JSON.stringify({ signature: dataUrl })
 *     });
 *   }}
 * />
 *
 * @example
 * // With error handling in parent component
 * const handleSaveSignature = async (dataUrl: string) => {
 *   try {
 *     const response = await api.saveSignature(dataUrl);
 *     if (!response.ok) throw new Error('Save failed');
 *   } catch (error) {
 *     throw new Error('Failed to save signature to server');
 *   }
 * };
 *
 * @param {SignaturePadProps} props - Component props
 * @param {number} [props.width=300] - Canvas width in pixels. Must be positive integer.
 * @param {number} [props.height=300] - Canvas height in pixels. Must be positive integer.
 * @param {number} [props.strokeWidth=0.5] - Thickness of signature stroke in pixels. Supports decimal values.
 * @param {string} [props.strokeColor='#fff'] - Hex color code for the signature stroke
 * @param {string} [props.fillColor='#000'] - Hex color code for the canvas background
 * @param {Function} [props.onSaveSignature=() => {}] - Async callback executed on save. Receives PNG data URL. Should throw Error on failure.
 * @param {boolean} [props.isSavingSignature] - A loading state when user is saving the signature
 *
 * @returns {JSX.Element} React component rendering canvas and control buttons
 *
 * @throws {Error} Toast notification displayed if:
 *   - Signature pad fails to initialize
 *   - Signature export fails
 *   - Save callback throws an error
 *
 * @example
 * // Full form integration
 * function SignatureForm() {
 *   const [submitted, setSubmitted] = useState(false);
 *
 *   const handleSubmit = async (dataUrl: string) => {
 *     // Validate, upload, etc.
 *     setSubmitted(true);
 *   };
 *
 *   return (
 *     <form>
 *       {!submitted && (
 *         <SignaturePad onSaveSignature={handleSubmit} />
 *       )}
 *       {submitted && <p>✓ Signature saved successfully</p>}
 *     </form>
 *   );
 * }
 */
function SignaturePad({
  width = 300,
  height = 300,
  onSaveSignature = () => {},
  isSavingSignature = false,
  maxSize = 5 * 1024 * 1024, // 5mb
  onCancel = () => {},
  showCancelAction = false,
  ...rest
}: SignatureSettings & {
  onSaveSignature?: (signatureData: string) => unknown | Promise<unknown>;
  maxSize?: number;
  isSavingSignature: boolean;
  onCancel?: () => void;
  showCancelAction?: boolean;
}) {
  const signatureRef = useRef<Signature | null>(null);

  // Initialization
  useEffect(() => {
    // Create the Signature instance AFTER the canvas is mounted
    signatureRef.current = new Signature({
      ...rest,
    });

    return () => {
      // Cleanup when component unmounts
      signatureRef.current?.removeEventListeners();
      signatureRef.current = null;
    };
  }, [rest]);

  /**
   * Clear the canvas to start new signature
   */
  const onClear = () => {
    signatureRef.current?.clearCanvas();
  };

  /**
   * Callback to manage the save functionality e.g. saving to database or reading signature value
   */
  const handleSave = async () => {
    try {
      if (isSavingSignature) return;

      if (!signatureRef.current) {
        toast.error('Signature pad not initialized');
        return;
      }
      const isEmpty = signatureRef.current.isEmpty();
      if (isEmpty) throw new Error('Signature is empty!');

      const signatureData = signatureRef.current.exportSignature();
      const size = signatureRef.current.getExportedImageSize('b');

      if (size > maxSize)
        throw new Error('Image too large to save as signature!');

      if (!signatureData) {
        toast.error('Failed to export signature');
        return;
      }

      await onSaveSignature(signatureData);
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : 'Saving signature has thrown an error!',
      );
    }
  };

  return (
    <div className="space-y-4">
      <canvas
        id="signature-canvas"
        className="w-full border border-border"
        width={width}
        height={height}
      />
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {showCancelAction && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={onClear}>
            Clear
          </Button>
          <Button onClick={handleSave} disabled={isSavingSignature}>
            {isSavingSignature ? (
              <span className="animate-spin">
                <Loader />
              </span>
            ) : (
              <Save />
            )}
            {isSavingSignature ? 'Saving Signature...' : 'Save Signature'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignaturePad;
