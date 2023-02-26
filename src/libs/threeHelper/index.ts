export const enableShadowOnObject = (object: THREE.Group) => {
  object.traverse((node) => {
    /* eslint-disable */
    node.castShadow = true;
    /* eslint-disable */
    node.receiveShadow = true;
  });
};
