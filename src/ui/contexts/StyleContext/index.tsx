import { createContext, useCallback, useState, useMemo, useEffect } from 'react';

type ContextValue = {
  windowWidth: number | undefined;
  getWindowWidth: () => number;
  windowHeight: number | undefined;
  isWindowSizeReady: boolean;
};

function createInitialContextValue(): ContextValue {
  return {
    windowWidth: undefined,
    getWindowWidth: () => 0,
    windowHeight: undefined,
    isWindowSizeReady: false,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState<number | undefined>(undefined);
  const [isWindowSizeReady, setIsWindowSizeReady] = useState(false);

  const updateWindowSize = useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
    setIsWindowSizeReady(true);
  }, []);

  useEffect(function updateWindowSizeOnInitEffect() {
    updateWindowSize();
  }, []);

  useEffect(function handleWindowResizeEffect() {
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  const getWindowWidth = useCallback(() => windowWidth || 0, [windowWidth]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          windowWidth,
          getWindowWidth,
          windowHeight,
          isWindowSizeReady,
        }),
        [windowWidth, getWindowWidth, windowHeight, isWindowSizeReady]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
