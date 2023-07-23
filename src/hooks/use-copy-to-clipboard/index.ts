import { useState, useEffect, useCallback } from 'react';

export function useCopyToClipboard(text: string): [copyToClipboard: () => void, isJustCopied: boolean] {
  const [isJustCopied, setIsJustCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    setIsJustCopied(true);
    globalThis.navigator.clipboard.writeText(text);
  }, [text]);

  useEffect(() => {
    if (isJustCopied) {
      setTimeout(() => {
        setIsJustCopied(false);
      }, 1000);
    }
  }, [isJustCopied]);

  return [copyToClipboard, isJustCopied];
}
