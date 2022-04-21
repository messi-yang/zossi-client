import { makeStore } from '@/stores';
import { setUnits, Unit } from './index';

describe('GameOfLife Reducer', () => {
  describe('setUnits', () => {
    it('Should correctly set units', () => {
      const units: Unit[][] = [
        [
          {
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
