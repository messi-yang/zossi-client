import { render, RenderResult, screen } from '@testing-library/react';
import { dataTestids } from './data-test-ids';
import { PositionInput } from '.';
import { PositionVo } from '@/models/world/common/position-vo';

function renderPositionInput(): RenderResult {
  return render(<PositionInput value={PositionVo.create(0, 0)} onInput={() => {}} />);
}

describe('PositionInput', () => {
  it('Should render component successfully.', () => {
    try {
      renderPositionInput();
      const wrapper = screen.getByTestId(dataTestids.root);
      expect(wrapper).toBeInTheDocument();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
