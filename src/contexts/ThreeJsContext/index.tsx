import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type CachedModels = {
  [modelSrc: string]: THREE.Group | 'loading' | undefined;
};

type ContextValue = {
  cachedModels: CachedModels;
  loadModel(modelSrc: string): void;
};

function createInitialContextValue(): ContextValue {
  return {
    cachedModels: {},
    loadModel: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const cachedModelsSource = useRef<CachedModels>({});
  const [cachedModels, setCachedModels] = useState<CachedModels>(cachedModelsSource.current);
  const [gltfLoader] = useState(() => new GLTFLoader());

  const loadModel = useCallback(
    (modelSrc: string) => {
      const cachedModel = cachedModels[modelSrc];
      if (cachedModel) {
        return;
      }

      cachedModelsSource.current[modelSrc] = 'loading';
      setCachedModels({ ...cachedModelsSource.current });

      gltfLoader.load(modelSrc, function (gltf) {
        cachedModelsSource.current[modelSrc] = gltf.scene;
        setCachedModels({ ...cachedModelsSource.current });
      });
    },
    [cachedModels]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          cachedModels,
          loadModel,
        }),
        [cachedModels, loadModel]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
