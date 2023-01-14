import { useState, RefObject, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useDomRect(ref: RefObject<HTMLElement>): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (ref.current && ResizeObserver) {
      setRect(ref.current.getBoundingClientRect());

      resizeObserver = new ResizeObserver((entries) => {
        const refCurrentElement = entries[0].target;
        setRect(refCurrentElement.getBoundingClientRect());
      });
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (resizeObserver && ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref.current]);

  return rect;
}
