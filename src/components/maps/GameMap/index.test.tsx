import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitBlockVo } from '@/models/valueObjects';
import { createOffset, createUnit, createUnitBlock } from '@/models/valueObjects/factories';

function renderGameMap(unitBlock: UnitBlockVo): RenderResult {
  return render(
    <GameMap
      area={null}
      areaOffset={createOffset(0, 0)}
      unitBlock={unitBlock}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[createUnit(true)]];
      renderGameMap(createUnitBlock(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
