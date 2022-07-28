import { render, RenderResult, screen } from '@testing-library/react';
import GameOfLifeMap from '.';
import dataTestids from './dataTestids';
import { Unit } from './types';

function renderGameOfLifeMap(units: Unit[][]): RenderResult {
  return render(
    <GameOfLifeMap
      area={{
        from: { x: 0, y: 0 },
        to: { x: units.length - 1, y: units.length - 1 },
      }}
      units={units}
      unitsPattern={[]}
      onUnitsPatternDrop={() => {}}
    />
  );
}

describe('GameOfLifeMap', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameOfLifeMap([]);
      const wrapper = screen.getByTestId(dataTestids.wrapper);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
