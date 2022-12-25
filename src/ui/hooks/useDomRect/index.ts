import { useState, RefObject, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useDomRect(ref: RefObject<HTMLElement>): DOMRect {
  const [rect, setRect] = useState<DOMRect>({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    toJSON: () => {},
  });

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
