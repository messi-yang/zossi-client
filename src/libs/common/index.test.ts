import { rangeMatrix } from '.';

describe('common', () => {
  describe('rangeMatrix', () => {
    it('Should iterate through the given range of matrix', () => {
      const res: [number, number][] = [];
      rangeMatrix(2, 2, (colIdx, rowIdx) => {
        res.push([colIdx, rowIdx]);
      });

      expect([
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]).toEqual(res);
    });
  });
});
