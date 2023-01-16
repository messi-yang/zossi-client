import { mapMatrix } from '.';

describe('common', () => {
  describe('mapMatrix', () => {
    it('Should convert matrix of string to matrix of number', () => {
      const stringMatrix = [
        ['1', '2', '3'],
        ['4', '5', '6'],
      ];
      const numberMatrix = mapMatrix(stringMatrix, (str) => parseInt(str, 10));

      expect(numberMatrix).toEqual([
        [1, 2, 3],
        [4, 5, 6],
      ]);
    });
  });
});
