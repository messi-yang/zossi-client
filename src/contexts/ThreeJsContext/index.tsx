import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

type LoadedModelMap = Record<string, THREE.Group | 'loading' | undefined>;

export const enableShadowOnObject = (object: THREE.Group) => {
  object.traverse((node) => {
    /* eslint-disable */
    node.castShadow = true;
    /* eslint-disable */
    node.receiveShadow = true;
  });
};

type ContextValue = {
  loadModel(modelSrc: string): void;
  createObject(modelSrc: string): THREE.Group | null;
};

function createInitialContextValue(): ContextValue {
  return {
    loadModel: () => {},
    createObject: () => null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [rerenderToken, setRerenderToken] = useState(() => Math.random());
  const loadedModelMap = useRef<LoadedModelMap>({});
  const [gltfLoader] = useState(() => new GLTFLoader());

  const loadModel = useCallback((modelSrc: string) => {
    if (loadedModelMap.current[modelSrc]) {
      return;
    }

    loadedModelMap.current[modelSrc] = 'loading';

    gltfLoader.load(modelSrc, function (gltf) {
      loadedModelMap.current[modelSrc] = gltf.scene;
      setRerenderToken(Math.random());
    });
  }, []);

  const createObject = useCallback(
    (modelSrc: string): THREE.Group | null => {
      const cachedModel = loadedModelMap.current[modelSrc];
      if (!cachedModel || cachedModel === 'loading') return null;

      const clonedModel = cachedModel.clone();
      enableShadowOnObject(clonedModel);
      return clonedModel;
    },
    [rerenderToken]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          loadModel,
          createObject,
        }),
        [loadModel, createObject]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
