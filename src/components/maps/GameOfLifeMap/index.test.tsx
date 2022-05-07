import { render, RenderResult, screen } from '@testing-library/react';
import GameOfLifeMap from '.';
import dataTestidMap from './dataTestid';
import { Units } from './types';

function renderGameOfLifeMap(units: Units): RenderResult {
  return render(
    <GameOfLifeMap
      units={units}
      relatCoordsForRevival={[]}
      onUnitsRevive={() => {}}
    />
  );
}

function generateLiveUnits(width: number, height: number): Units {
  const units: Units = [];

  for (let x = 0; x < width; x += 1) {
    units.push([]);
    for (let y = 0; y < height; y += 1) {
      units[x].push({
        coordinate: { x, y },
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
      console.error(e);
      expect(true).toBe(false);
    }
  });
  it('Should render 3x3 unit boxes.', () => {
    try {
      const units: Units = generateLiveUnits(3, 3);
      renderGameOfLifeMap(units);
      const unitBoxes = screen.getAllByTestId(dataTestidMap.unitBox);
      expect(unitBoxes.length).toBe(9);
    } catch (e) {
      console.error(e);
      expect(true).toBe(false);
    }
  });
});
