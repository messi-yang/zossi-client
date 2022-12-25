import { useState, useEffect } from 'react';

export default function useResolutionCalculator(
  size: {
    width: number;
    height: number;
  },
  unitSize: number
): [number, number] {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(Math.ceil(size.width / unitSize) || 1);
    setHeight(Math.ceil(size.height / unitSize) || 1);
  }, [size]);

  return [width, height];
}
