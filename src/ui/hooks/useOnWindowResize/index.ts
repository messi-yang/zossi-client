import { useEffect } from 'react';

export default function useOnWindowResize(handler: () => void) {
  useEffect(() => {
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [handler]);
}
