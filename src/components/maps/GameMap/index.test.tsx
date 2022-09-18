import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { UnitValueObject, UnitMapValueObject, OffsetValueObject, UnitPatternValueObject } from '@/valueObjects';

function renderGameMap(unitMap: UnitMapValueObject): RenderResult {
  return render(
    <GameMap
      area={null}
      areaOffset={new OffsetValueObject(0, 0)}
      unitMap={unitMap}
      unitPattern={new UnitPatternValueObject([[true]])}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      const unitMatrix = [[new UnitValueObject(true, 0)]];
      renderGameMap(new UnitMapValueObject(unitMatrix));
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
