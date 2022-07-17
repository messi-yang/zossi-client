import { render, RenderResult, screen } from '@testing-library/react';
import GameOfLifeMap from '.';
import dataTestidMap from './dataTestidMap';
import { Unit } from './types';

function renderGameOfLifeMap(units: Unit[][]): RenderResult {
  return render(
    <GameOfLifeMap
      area={{
        from: { x: 0, y: 0 },
        to: { x: units.length - 1, y: units.length - 1 },
      }}
      units={units}
      relatCoordsForRevival={[]}
      onUnitsRevive={() => {}}
    />
  );
}

function generateLiveUnits(width: number, height: number): Unit[][] {
  const units: Unit[][] = [];

  for (let x = 0; x < width; x += 1) {
    units.push([]);
    for (let y = 0; y < height; y += 1) {
      units[x].push({
        alive: true,
        age: 0,
      });
    }
  }

  return units;
}

describe('GameOfLifeMap', () => {
  it('Should render component successfully.', () => {
    try {
      renderGameOfLifeMap([]);
      const wrapper = screen.getByTestId(dataTestidMap.wrapper);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
  it('Should render 3x3 unit boxes.', () => {
    try {
      const units: Unit[][] = generateLiveUnits(3, 3);
      renderGameOfLifeMap(units);
      const unitBoxes = screen.getAllByTestId(dataTestidMap.unitBox);
      expect(unitBoxes.length).toBe(9);
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
