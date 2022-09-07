import { useEffect, useState, RefObject } from 'react';

type Callbacks = {
  onPullStart?: (x: number, y: number) => void;
  onPull?: (x: number, y: number) => void;
};

export default function usePull(ref: RefObject<HTMLElement>, { onPullStart, onPull }: Callbacks) {
  const [isDragStarted, setIsDragStarted] = useState(false);

  useEffect(() => {
    const handleMouseDown = (event: globalThis.MouseEvent) => {
      onPullStart?.(event.clientX, event.clientY);
      setIsDragStarted(true);
    };
    const handleTouchStart = (event: globalThis.TouchEvent) => {
      onPullStart?.(event.touches[0].clientX, event.touches[0].clientY);
      setIsDragStarted(true);
    };
    if (ref.current) {
      ref.current.addEventListener('mousedown', handleMouseDown);
      ref.current.addEventListener('touchstart', handleTouchStart);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('mousedown', handleMouseDown);
        ref.current.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [ref.current]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragStarted(false);
    };
    const handleTouchEnd = () => {
      setIsDragStarted(false);
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: globalThis.MouseEvent) => {
      if (!isDragStarted) {
        return;
      }
      onPull?.(event.clientX, event.clientY);
    };
    const handleTouchMove = (event: globalThis.TouchEvent) => {
      if (!isDragStarted) {
        return;
      }
      onPull?.(event.touches[0].clientX, event.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragStarted]);
}
