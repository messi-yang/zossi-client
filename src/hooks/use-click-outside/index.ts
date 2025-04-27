import { useEffect, useRef } from 'react';

export function useClickOutside(dom: HTMLElement | null, callback: () => void): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!dom) return () => {};

    const handleClickOutside = (event: MouseEvent) => {
      if (dom && !dom.contains(event.target as Node)) {
        callbackRef.current();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dom]);
}
