import { render, RenderResult, screen } from '@testing-library/react';
import UnitSquare from '.';
import dataTestids from './dataTestids';

function renderUnitSquare(): RenderResult {
  return render(
    <UnitSquare
      coordinateX={0}
      coordinateY={0}
      alive
      highlighted={false}
      hasTopBorder
      hasLeftBorder
      hasBottomBorder
      hasRightBorder
    />
  );
}

describe('UnitSquare', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitSquare();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
