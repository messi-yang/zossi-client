import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import type { UnitVO } from '@/valueObjects';

function renderGameMap(unitMap: UnitVO[][]): RenderResult {
  return render(
    <GameMap
      displayedArea={null}
      targetArea={null}
      unitMap={unitMap}
      unitPattern={[]}
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
