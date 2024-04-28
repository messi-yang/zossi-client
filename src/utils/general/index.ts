export function sleep(miniSeconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, miniSeconds);
  });
}
