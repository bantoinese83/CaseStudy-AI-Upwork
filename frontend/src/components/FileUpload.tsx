/** File upload component with drag-and-drop support. */

import { useCallback, useState } from 'react';
import { uploadFile } from '../services/api.service';
import { getErrorMessage } from '../utils/errors';
import { ErrorAlert, LoadingSpinner } from './ui';
import { MAX_FILE_SIZE_MB, SUPPORTED_FILE_TYPES } from '../constants';
import type { UploadResponse } from '../types';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      return `File exceeds ${MAX_FILE_SIZE_MB}MB limit (${fileSizeMB.toFixed(1)}MB)`;
    }

    // Check file type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_FILE_TYPES.includes(fileExt as (typeof SUPPORTED_FILE_TYPES)[number])) {
      return `Unsupported file type. Supported: ${SUPPORTED_FILE_TYPES.join(', ')}`;
    }

    return null;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setUploading(true);
      setError(null);
      setSuccess(null);
      setUploadProgress(`Uploading ${file.name}...`);

      try {
        const result: UploadResponse = await uploadFile(file);
        if (result.success) {
          setSuccess(`✓ ${result.filename} uploaded successfully`);
          setUploadProgress(null);
          onUploadSuccess?.();
          // Clear success message after 5 seconds
          setTimeout(() => setSuccess(null), 5000);
        } else {
          setError(result.message || 'Upload failed');
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [onUploadSuccess]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];
      if (file) {
        handleUpload(file); // Upload first file only
      }
    },
    [handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      const file = files?.[0];
      if (file) {
        handleUpload(file);
      }
      // Reset input
      e.target.value = '';
    },
    [handleUpload]
  );

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-sm p-8 text-center transition-all duration-200
          ${
            isDragging
              ? 'border-ice bg-void-surface-light'
              : 'border-zinc-800 bg-void-surface hover:border-zinc-700'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={SUPPORTED_FILE_TYPES.join(',')}
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-3">
            <div className="flex justify-center">
              <img src="/folders-icon.svg" alt="Upload files" className="w-12 h-12 opacity-80" />
            </div>
            <div>
              <p className="text-sm font-mono text-zinc-400 mb-1">
                {isDragging ? '[ DROP FILE HERE ]' : '[ DRAG & DROP OR CLICK TO UPLOAD ]'}
              </p>
              <p className="text-xs text-zinc-600 font-mono">
                Supported: {SUPPORTED_FILE_TYPES.join(', ')} • Max: {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        </label>
      </div>

      {uploadProgress && (
        <div className="text-xs font-mono text-zinc-500 text-center">
          {'>'} {uploadProgress}
        </div>
      )}

      {uploading && (
        <div className="flex justify-center">
          <LoadingSpinner size="sm" message="Uploading and processing..." />
        </div>
      )}

      {error && (
        <ErrorAlert message={error} onDismiss={() => setError(null)} title="UPLOAD ERROR" />
      )}

      {success && (
        <div className="p-3 bg-void-surface border border-ice/30 rounded-sm">
          <p className="text-xs font-mono text-ice text-center">{success}</p>
        </div>
      )}
    </div>
  );
}
