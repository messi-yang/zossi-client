import { useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';

type CachedObjectMap = Record<string, THREE.Group | undefined>;

export default function use3dObjectPool(scene: THREE.Scene) {
  const cachedObjectMap = useRef<CachedObjectMap>({});

  const getObjectFromScene = useCallback((key: string): THREE.Group | null => cachedObjectMap.current[key] || null, []);

  const addObjectToScene = useCallback(
    (key: string, obj: THREE.Group) => {
      cachedObjectMap.current[key] = obj;
      scene.add(obj);
    },
    [scene]
  );

  const recycleObjectsFromScene = useCallback(
    (keptObjectKeys: string[]) => {
      const keptObjectKeysMap: Record<string, true> = {};
      keptObjectKeys.forEach((key) => {
        keptObjectKeysMap[key] = true;
      }, {});
      Object.keys(cachedObjectMap.current).forEach((key: string) => {
        const cachedObject = cachedObjectMap.current[key];
        if (!cachedObject) return;

        if (!keptObjectKeysMap[key]) {
          scene.remove(cachedObject);
          delete cachedObjectMap.current[key];
        }
      });
    },
    [scene]
  );

  useEffect(
    function cleanAllObjectsOnSceneChange() {
      return () => {
        Object.keys(cachedObjectMap).forEach((key: string) => {
          const cachedObject = cachedObjectMap.current[key];
          if (!cachedObject) return;

          scene.remove(cachedObject);
          delete cachedObjectMap.current[key];
        });
      };
    },
    [scene]
  );

  return { getObjectFromScene, addObjectToScene, recycleObjectsFromScene };
}
