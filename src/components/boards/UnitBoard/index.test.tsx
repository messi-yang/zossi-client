import { render, RenderResult, screen } from '@testing-library/react';
import { createUnitMap, createUnit } from '@/valueObjects/factories';
import UnitBoard, { dataTestids } from '.';

function renderUnitBoard(): RenderResult {
  return render(<UnitBoard unitMap={createUnitMap([[createUnit(true, 0)]])} unitSize={20} onUnitClick={() => {}} />);
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
