import { createContext, useCallback, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FontLoader, Font } from 'three/examples/jsm/loaders/FontLoader';

type LoadedModelMap = Record<string, THREE.Group | 'loading' | undefined>;
type LoadedFontMap = Record<string, Font | 'loading' | undefined>;

type ContextValue = {
  downloadTjsModel(modelSrc: string): THREE.Group | null;
  downloadTjsFont(fontSrc: string): Font | null;
};

function createInitialContextValue(): ContextValue {
  return {
    downloadTjsModel: () => null,
    downloadTjsFont: () => null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [gltfLoader] = useState(() => new GLTFLoader());
  const [loadedModelMap, setLoadedModelMap] = useState<LoadedModelMap>({});

  const [fontLoader] = useState(() => new FontLoader());
  const [loadedFontMap, setLoadedFontMap] = useState<LoadedFontMap>({});

  const downloadTjsModel = useCallback(
    (modelSrc: string): THREE.Group | null => {
      const loadedModel = loadedModelMap[modelSrc];
      if (loadedModel === 'loading') {
        return null;
      } else if (loadedModel === undefined) {
        setLoadedModelMap((prev) => ({ ...prev, [modelSrc]: 'loading' }));

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
          setLoadedModelMap((prev) => ({ ...prev, [modelSrc]: gltf.scene }));
        });
        return null;
      } else {
        return loadedModel;
      }
    },
    [loadedModelMap]
  );

  const downloadTjsFont = useCallback(
    (fontSrc: string): Font | null => {
      const loadedFont = loadedFontMap[fontSrc];
      if (loadedFont === 'loading') {
        return null;
      } else if (loadedFont === undefined) {
        setLoadedFontMap((prev) => ({ ...prev, [fontSrc]: 'loading' }));
        fontLoader.load(fontSrc, (font) => {
          setLoadedFontMap((prev) => ({ ...prev, [fontSrc]: font }));
        });
        return null;
      } else {
        return loadedFont;
      }
    },
    [loadedFontMap]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          downloadTjsModel,
          downloadTjsFont,
        }),
        [downloadTjsModel, downloadTjsFont]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as TjsProvider, Context as TjsContext };
