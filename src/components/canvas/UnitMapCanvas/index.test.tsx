import { render, RenderResult, screen } from '@testing-library/react';
import UnitMapCanvas, { dataTestids } from '.';

function renderUnitMapCanvas(): RenderResult {
  return render(<UnitMapCanvas unitMap={[[]]} unitSize={20} />);
}

describe('UnitMapCanvas', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitMapCanvas();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
