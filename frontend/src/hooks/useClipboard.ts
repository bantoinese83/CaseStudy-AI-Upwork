/** Custom hook for clipboard operations. */

import { useCallback, useRef } from 'react';
import { COPY_FEEDBACK_DURATION } from '../constants';

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isSupported: boolean;
}

/**
 * Hook for clipboard operations with feedback.
 * Handles browser compatibility and error cases.
 */
export function useClipboard(): UseClipboardReturn {
  const copy = useCallback(async (text: string): Promise<boolean> => {
    // Check if clipboard API is available
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }, []);

  const isSupported =
    typeof navigator !== 'undefined' &&
    (navigator.clipboard !== undefined || document.execCommand !== undefined);

  return { copy, isSupported };
}

/**
 * Hook for clipboard with button feedback.
 */
export function useClipboardWithFeedback() {
  const { copy, isSupported } = useClipboard();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const copyWithFeedback = useCallback(
    async (text: string): Promise<boolean> => {
      const success = await copy(text);
      const button = buttonRef.current;

      if (button && success) {
        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }

        const originalText = button.textContent ?? '';
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600');
        button.classList.remove('bg-blue-600');

        timeoutRef.current = window.setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove('bg-green-600');
          button.classList.add('bg-blue-600');
          timeoutRef.current = null;
        }, COPY_FEEDBACK_DURATION);
      }

      return success;
    },
    [copy]
  );

  return {
    copyWithFeedback,
    buttonRef,
    isSupported,
  };
}
