import { render, RenderResult, screen } from '@testing-library/react';
import UnitSquare, { dataTestids } from '.';

function renderUnitSquare(): RenderResult {
  return render(<UnitSquare alive highlighted={false} hasTopBorder hasLeftBorder hasBottomBorder hasRightBorder />);
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
