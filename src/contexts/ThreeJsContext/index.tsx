import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type CachedModels = {
  [modelSrc: string]: THREE.Group | 'loading' | undefined;
};

type ContextValue = {
  loadModel(modelSrc: string): void;
  cloneModel(modelSrc: string): THREE.Group | null;
};

function createInitialContextValue(): ContextValue {
  return {
    loadModel: () => {},
    cloneModel: () => null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [cacheToken, setCacheToken] = useState(() => Math.random());
  const cachedModels = useRef<CachedModels>({});
  const [gltfLoader] = useState(() => new GLTFLoader());

  const loadModel = useCallback((modelSrc: string) => {
    if (cachedModels.current[modelSrc]) {
      return;
    }

    cachedModels.current[modelSrc] = 'loading';

    gltfLoader.load(modelSrc, function (gltf) {
      cachedModels.current[modelSrc] = gltf.scene;
      setCacheToken(Math.random());
    });
  }, []);

  const cloneModel = useCallback(
    (modelSrc: string): THREE.Group | null => {
      const cachedModel = cachedModels.current[modelSrc];
      if (!cachedModel || cachedModel === 'loading') return null;

      return cachedModel.clone();
    },
    [cacheToken]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          loadModel,
          cloneModel,
        }),
        [loadModel, cloneModel]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
