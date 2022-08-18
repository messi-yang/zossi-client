import { makeStore } from '@/stores';
import type { UnitVO } from '@/valueObjects';
import { setUnits } from './index';

describe('GameOfLife Reducer', () => {
  describe('setUnits', () => {
    it('Should correctly set units', () => {
      const units: UnitVO[][] = [
        [
          {
            coordinate: { x: 0, y: 0 },
            alive: true,
            age: 0,
          },
        ],
      ];
      const store = makeStore();
      store.dispatch(setUnits(units));

      expect(store.getState().gameOfLife.units).toEqual(units);
    });
  });
});
