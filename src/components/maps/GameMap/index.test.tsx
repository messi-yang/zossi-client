import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitVO, UnitMapVO, OffsetVO, UnitPatternVO } from '@/valueObjects';

function renderGameMap(unitMap: UnitMapVO): RenderResult {
  return render(
    <GameMap
      area={null}
      areaOffset={new OffsetVO(0, 0)}
      unitMap={unitMap}
      unitPattern={new UnitPatternVO([[true]])}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[new UnitVO(true, 0)]];
      renderGameMap(new UnitMapVO(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
