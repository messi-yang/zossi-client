import { useCallback, useEffect, useState } from 'react';

export function useHotKeys(keys: string[], options: { onPressedKeysChange: (keys: string[]) => void }) {
  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const keyDownHandler: (this: Window, ev: KeyboardEvent) => void = useCallback(
    ({ code }) => {
      if (keys.indexOf(code) > -1 && keysPressed.indexOf(code) === -1) {
        const newKeysPressed = [...keysPressed, code];
        setKeysPressed(newKeysPressed);
        options.onPressedKeysChange(newKeysPressed);
      }
    },
    [options.onPressedKeysChange, keysPressed]
  );

  const keyUpHandler: (this: Window, ev: KeyboardEvent) => void = useCallback(
    ({ code }) => {
      if (keys.indexOf(code) > -1 && keysPressed.indexOf(code) > -1) {
        const newKeysPressed = keysPressed.filter((key) => key !== code);
        setKeysPressed(newKeysPressed);
        options.onPressedKeysChange(newKeysPressed);
      }
    },
    [options.onPressedKeysChange, keysPressed]
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden') {
      setKeysPressed([]);
      options.onPressedKeysChange([]);
    }
  }, [options.onPressedKeysChange, keysPressed]);

  const handleWindowBlur = useCallback(() => {
    setKeysPressed([]);
    options.onPressedKeysChange([]);
  }, [options.onPressedKeysChange, keysPressed]);

  useEffect(() => {
    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [keyDownHandler, keyUpHandler]);
}
