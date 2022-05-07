import { useState, RefObject, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default function useElementResolutionCalculator(
  ref: RefObject<HTMLElement>,
  unitSize: number
): [number, number] {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (ref.current && ResizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        const refCurrentElement = entries[0].target;
        const boundary = refCurrentElement.getBoundingClientRect();
        const elementWidth = boundary.width;
        const elementHeight = boundary.height;

        setWidth(Math.floor(elementWidth / unitSize) || 1);
        setHeight(Math.floor(elementHeight / unitSize) || 1);
      });
      resizeObserver.observe(ref.current);
    }

    return () => {
      if (resizeObserver && ref.current) {
        resizeObserver.unobserve(ref.current);
      }
    };
  }, [ref.current, unitSize]);

  return [width, height];
}
