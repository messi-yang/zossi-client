import { makeStore } from '@/stores';
import type { UnitEntity } from '@/entities';
import { setUnits } from './index';

describe('GameOfLife Reducer', () => {
  describe('setUnits', () => {
    it('Should correctly set units', () => {
      const units: UnitEntity[][] = [
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
