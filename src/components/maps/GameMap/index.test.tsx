import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitVo, UnitMapVo, OffsetVo, UnitPatternVo } from '@/valueObjects';

function renderGameMap(unitMap: UnitMapVo): RenderResult {
  return render(
    <GameMap
      area={null}
      areaOffset={new OffsetVo(0, 0)}
      unitMap={unitMap}
      unitPattern={new UnitPatternVo([[true]])}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[new UnitVo(true, 0)]];
      renderGameMap(new UnitMapVo(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
