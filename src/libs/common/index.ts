export function mapMatrix<T, M>(matrix: T[][], transformer: (unit: T, i: number, j: number) => M): M[][] {
  return matrix.map((row, i) => row.map((unit, j) => transformer(unit, i, j)));
}
