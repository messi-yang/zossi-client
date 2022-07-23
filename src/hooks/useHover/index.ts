import { useCallback, RefObject, useEffect } from 'react';

export default function useHover(
  ref: RefObject<Element>,
  onHoverStateChange: (hovered: boolean) => any
) {
  const handleMouseOver = useCallback(() => {
    onHoverStateChange(true);
  }, [onHoverStateChange]);
  const handleMouseOut = useCallback(() => {
    onHoverStateChange(false);
  }, [onHoverStateChange]);

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
  }, [ref.current, handleMouseOver, handleMouseOut]);
}
