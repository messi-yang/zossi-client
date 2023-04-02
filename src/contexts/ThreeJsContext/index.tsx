import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';

type LoadedModelMap = Record<string, THREE.Group | 'loading' | undefined>;
type LoadedFontMap = Record<string, Font | 'loading' | undefined>;

type ContextValue = {
  loadModel(modelSrc: string): void;
  createObject(modelSrc: string): THREE.Group | null;
  loadFont(fontSrc: string): void;
  getFont(fontSrc: string): Font | null;
};

function createInitialContextValue(): ContextValue {
  return {
    loadModel: () => {},
    createObject: () => null,
    loadFont: () => {},
    getFont: () => null,
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

  const [fontLoader] = useState(() => new FontLoader());
  const loadedFontMap = useRef<LoadedFontMap>({});
  const [fontRerenderToken, setFontRerenderToken] = useState(() => Math.random());

  const loadModel = useCallback((modelSrc: string) => {
    if (loadedModelMap.current[modelSrc]) {
      return;
    }

    loadedModelMap.current[modelSrc] = 'loading';

    gltfLoader.load(modelSrc, function (gltf) {
      gltf.scene.traverse((node) => {
        // TODO - if THREE improves their TS supports, remove the hack below
        if ((node as THREE.Mesh).isMesh) {
          const nextNode = node as THREE.Mesh;
          nextNode.castShadow = true;
          nextNode.receiveShadow = true;
          nextNode.frustumCulled = true;
        }
      });
      loadedModelMap.current[modelSrc] = gltf.scene;
      setRerenderToken(Math.random());
    });
  }, []);

  const createObject = useCallback(
    (modelSrc: string): THREE.Group | null => {
      const loadedModel = loadedModelMap.current[modelSrc];
      if (!loadedModel || loadedModel === 'loading') return null;

      const clonedModel = loadedModel.clone();
      return clonedModel;
    },
    [rerenderToken]
  );

  const loadFont = useCallback((fontSrc: string) => {
    loadedFontMap.current[fontSrc] = 'loading';
    fontLoader.load(fontSrc, (font) => {
      loadedFontMap.current[fontSrc] = font;
      setFontRerenderToken(Math.random());
    });
  }, []);

  const getFont = useCallback(
    (modelSrc: string): Font | null => {
      const loadedFont = loadedFontMap.current[modelSrc];
      if (!loadedFont || loadedFont === 'loading') return null;

      return loadedFont;
    },
    [fontRerenderToken]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          loadModel,
          createObject,
          loadFont,
          getFont,
        }),
        [loadModel, createObject, loadFont, getFont]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
