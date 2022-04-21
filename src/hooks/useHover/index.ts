import { useState, useCallback, RefObject, useEffect } from 'react';

export default function useHover(ref: RefObject<HTMLElement>) {
  const [hovered, setHovered] = useState<boolean>(false);

  const handleMouseOver = useCallback(() => setHovered(true), []);
  const handleMouseOut = useCallback(() => setHovered(false), []);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mouseover', handleMouseOver);
      ref.current.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mouseover', handleMouseOver);
        ref.current.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [ref.current]);

  return [hovered];
}
