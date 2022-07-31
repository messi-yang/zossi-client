import { render, RenderResult, screen } from '@testing-library/react';
import GameMap, { dataTestids } from '.';
import { Unit } from './types';

function renderGameMap(units: Unit[][]): RenderResult {
  return render(
    <GameMap
      area={{
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
