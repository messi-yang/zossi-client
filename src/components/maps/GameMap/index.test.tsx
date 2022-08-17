import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import type { UnitEntity } from '@/entities';

function renderGameMap(units: UnitEntity[][]): RenderResult {
  return render(
    <GameMap
      displayedArea={{
        from: { x: 0, y: 0 },
        to: { x: units.length - 1, y: units.length - 1 },
      }}
      targetArea={{
        from: { x: 0, y: 0 },
        to: { x: units.length - 1, y: units.length - 1 },
      }}
      units={units}
      relativeCoordinates={[]}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameMap([]);
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
