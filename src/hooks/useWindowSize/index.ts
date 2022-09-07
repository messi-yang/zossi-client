import { useState, useEffect } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

function useWindowSize(): WindowSize {
  const [isSizeInitialized, setIsSizeInitialized] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: globalThis.innerWidth || 0,
    height: globalThis.innerHeight || 0,
  });

  const handleWindowResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    if (!isSizeInitialized) {
      handleWindowResize();
      setIsSizeInitialized(true);
    }
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return windowSize;
}

export default useWindowSize;
