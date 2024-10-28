import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { ColorVo } from '@/models/world/common/color-vo';

export type InstancedMeshInfo = {
  mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  meshScale: THREE.Vector3;
  meshPosition: THREE.Vector3;
  meshQuaternion: THREE.Quaternion;
};

export type InstanceState = {
  x: number;
  y: number;
  z: number;
  rotate: number;
  color?: ColorVo;
};

export const createTextMesh = (
  font: Font,
  text: string,
  x: number,
  y: number,
  z: number
): THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial> => {
  const textGeometry = new TextGeometry(text, {
    font,
    size: 0.35,
    height: 0.05,
  });
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  textGeometry.computeBoundingBox();
  textGeometry.center();
  textMesh.position.set(x, y, z);
  textMesh.rotation.set(-Math.PI / 6, 0, 0);

  return textMesh;
};

export const createInstancesInScene = (scene: THREE.Scene, model: THREE.Group, instanceStates: InstanceState[]): (() => void) => {
  const modelMeshes: THREE.Mesh[] = [];
  model.traverse((node) => {
    const currentNode = node as THREE.Mesh;
    if (currentNode.isMesh) modelMeshes.push(currentNode);
  });

  const modelInstancedMeshInfos: InstancedMeshInfo[] = modelMeshes.map((baseObjMesh) => {
    // TEST
    // const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });

    const mesh = new THREE.InstancedMesh(baseObjMesh.geometry, baseObjMesh.material, instanceStates.length);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    return {
      mesh,
      meshScale: baseObjMesh.getWorldScale(new THREE.Vector3()),
      meshPosition: baseObjMesh.getWorldPosition(new THREE.Vector3()),
      meshQuaternion: baseObjMesh.getWorldQuaternion(new THREE.Quaternion()),
    };
  });

  instanceStates.forEach((instanceState, instanceStateIdx) => {
    modelInstancedMeshInfos.forEach(({ mesh, meshScale, meshQuaternion, meshPosition }) => {
      const meshOrbitRadius = Math.sqrt(meshPosition.x * meshPosition.x + meshPosition.z * meshPosition.z);

      let meshOrbitalAngle = meshOrbitRadius !== 0 ? Math.asin(meshPosition.z / meshOrbitRadius) : 0;
      meshOrbitalAngle = meshPosition.x >= 0 ? meshOrbitalAngle : Math.PI - meshOrbitalAngle;

      const meshPosAfterRotation = new THREE.Vector3(
        meshOrbitRadius * Math.cos(meshOrbitalAngle - instanceState.rotate),
        meshPosition.y,
        meshOrbitRadius * Math.sin(meshOrbitalAngle - instanceState.rotate)
      );

      const position = new THREE.Vector3(instanceState.x, instanceState.y, instanceState.z).add(meshPosAfterRotation);
      const quaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), instanceState.rotate).multiply(meshQuaternion);

      const matrix = new THREE.Matrix4().compose(position, quaternion, meshScale);
      mesh.setMatrixAt(instanceStateIdx, matrix);
      if (instanceState.color) {
        mesh.setColorAt(instanceStateIdx, new THREE.Color(instanceState.color.toRgb()));
      }
    });
  });

  modelInstancedMeshInfos.forEach(({ mesh }) => {
    scene.add(mesh);
  });

  return () => {
    modelInstancedMeshInfos.forEach(({ mesh }) => {
      scene.remove(mesh);
    });
  };
};
