import { useState, RefObject, useEffect } from 'react';

export default function useElementResolutionCalculator(
  ref: RefObject<HTMLElement>,
  unitSize: number
): [number, number] {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    let resizeObserver: ResizeObserver;
    if (ref.current && window.ResizeObserver) {
      resizeObserver = new window.ResizeObserver((entries) => {
        const refCurrentElement = entries[0].target;
        const elementWidth = refCurrentElement.clientWidth;
        const elementHeight = refCurrentElement.clientHeight;

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
