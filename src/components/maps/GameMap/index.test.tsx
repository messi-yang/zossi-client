import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import type { UnitVO } from '@/valueObjects';

function renderGameMap(unitMap: UnitVO[][]): RenderResult {
  return render(
    <GameMap
      zoomedArea={null}
      zoomedAreaOffset={{ x: 0, y: 0 }}
      unitMap={unitMap}
      unitPattern={[[true]]}
      onUnitsRevive={() => {}}
      onAreaUpdate={() => {}}
    />
  );
}

describe('GameMap', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameMap([[{ alive: true, age: 0 }]]);
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
