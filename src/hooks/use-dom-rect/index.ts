import { useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export function useDomRect(dom: HTMLElement | null): DOMRect | null {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (dom && ResizeObserver) {
      setRect(dom.getBoundingClientRect());

      resizeObserver = new ResizeObserver((entries) => {
        const refCurrentElement = entries[0].target;
        setRect(refCurrentElement.getBoundingClientRect());
      });
      resizeObserver.observe(dom);
    }

    return () => {
      if (resizeObserver && dom) {
        resizeObserver.unobserve(dom);
      }
    };
  }, [dom]);

  return rect;
}
