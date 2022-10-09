import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitMapValueObject } from '@/valueObjects';
import { createOffset, createUnit, createUnitMap, createUnitPattern } from '@/valueObjects/factories';

function renderGameMap(unitMap: UnitMapValueObject): RenderResult {
  return render(
    <GameMap
      area={null}
      areaOffset={createOffset(0, 0)}
      unitMap={unitMap}
      unitPattern={createUnitPattern([[true]])}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[createUnit(true, 0)]];
      renderGameMap(createUnitMap(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
