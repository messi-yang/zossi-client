export const pause = async (time: number) =>
  new Promise((res, rej) => {
    try {
      setTimeout(res, time);
    } catch (e) {
      rej(e);
    }
  });

export default {};

export function traverseMatrix<T>(
  matrix: T[][],
  callback: (x: number, y: number, unit: T) => any
) {
  matrix.forEach((rows, rowIdx) => {
    rows.forEach((unit, colIdx) => {
      callback(rowIdx, colIdx, unit);
    });
  });
}
