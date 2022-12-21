import { render, RenderResult, screen } from '@testing-library/react';
import { createUnitBlock, createUnit } from '@/models/valueObjects/factories';
import UnitBoard, { dataTestids } from '.';

function renderUnitBoard(): RenderResult {
  return render(<UnitBoard unitBlock={createUnitBlock([[createUnit(true)]])} unitSize={20} onUnitClick={() => {}} />);
}

describe('UnitBoard', () => {
  it('Should render component successfully.', () => {
    try {
      renderUnitBoard();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
