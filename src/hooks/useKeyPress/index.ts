import { useEffect, useState } from 'react';

export default function useKeyPress(targetKey: string, options?: { onKeyDown?: () => void }) {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyDownHandler: (this: Window, ev: KeyboardEvent) => void = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(true);
      options?.onKeyDown?.();
    }
  };

  const keyUpHandler: (this: Window, ev: KeyboardEvent) => void = ({ key }) => {
    if (key === targetKey) setKeyPressed(false);
  };

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
    };
  }, [options?.onKeyDown]);

  return keyPressed;
}
